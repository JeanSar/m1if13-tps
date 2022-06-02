import {Request, Response, Router} from "express";
import {CRUDcreate} from "./genericsCRUD"
import {zrrs} from "./ZRR";
import {body, query, validationResult} from "express-validator";
import {tresors} from "./Tresor";
import {users} from "./User";
import {Tresor, Position, Limites} from "../Types/types";

const adminRouter = Router();


let gameIsStarted: boolean = false;

setInterval(() => {
    if(!gameIsStarted){
        return;
    }
    for(let user of users) {
        if(user.aventurier.ttl > 0 && user.isRegisterInToZRR) {
            if(notInZRR(user.aventurier.position,zrrs[0])){
                user.aventurier.ttl = 0;
            }
            else{
                user.aventurier.ttl --;
            }
        }
    }
}, 1000);

function notInZRR(pos: Position, l: Limites){

    return (pos.x > l.limite_NO.x 
        || pos.x < l.limite_SE.x 
        || pos.y > l.limite_SE.y
        || pos.y < l.limite_NO.y
    );
}

adminRouter.post("/areaLimit",
    body("limite_NE.x").isNumeric(),
    body("limite_NE.y").isNumeric(),
    body("limite_NO.x").isNumeric(),
    body("limite_NO.y").isNumeric(),
    body("limite_SE.x").isNumeric(),
    body("limite_SE.y").isNumeric(),
    body("limite_SO.x").isNumeric(),
    body("limite_SO.y").isNumeric(),
    ((req: Request, res: Response) => {
        // Au début on pensais que l'on pourrait avoir plusieurs ZRR, on avait donc mis un tableau
        // Par la suite on s'est rendu compte qu'il n'en fallait qu'une seule
        // Donc pour éviter de "casser" la logique qui consistait à travailler sur un tableau
        // On s'assure que le tableau ne contient qu'un élément ce qui revient à un avoir un seul objet
        if(zrrs.length > 0) {
            zrrs.pop();
            if(gameIsStarted) {
                if(tresors.length != 0) {
                    tresors.splice(0, tresors.length)
                }
                for(let user of users) {
                    user.isRegisterInToZRR = false;
                    user.aventurier.tresors = [];
                }
                gameIsStarted = false;
            } 
        }
    return CRUDcreate(zrrs, req, res);
}));

adminRouter.post('/ttlInit',
    body('ttl').isInt({min: 0}).optional(),
    ((req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    for(let user of users){
        user.aventurier.ttl = req.body.ttl === undefined ? 1 : req.body.ttl;
    }

    res.statusMessage = "ttl init"
    return res.sendStatus(204);
}));

adminRouter.post('/startGame', ((req: Request, res: Response) => {
    if(gameIsStarted) {
        if(tresors.length != 0) {
            tresors.splice(0, tresors.length)
        }
        for(let user of users) {
            user.aventurier.tresors = [];
        }
    } else {
        gameIsStarted = true;
    }
    return res.sendStatus(204);
}));

adminRouter.get('/startGame', (req: Request, res: Response) => {
    res.status(200);
    return res.send({isGameStarted: gameIsStarted});
});

// Pour récupérer la zrr si elle a déjà été crée lros d'un refresh de la page
adminRouter.get('/ZRR', (req: Request, res: Response) => {
   if(zrrs.length > 0) {
       res.status(200);
       res.send(zrrs[0]);
   } else {
       return res.sendStatus(404); // Pas encore de zrr crée
   }
});

adminRouter.post('/popTresor',
    body('position.x').isFloat(),
    body('position.y').isFloat(),
    body('composition').isString(),
    ((req: Request, res: Response) => {
        CRUDcreate<Tresor>(tresors, req, res);
}));

adminRouter.get('/playerPositon', query('id').isString(), ((req: Request, res: Response) => {
    const id = req.query.id;
    const user = users.find(e => e.aventurier.id === id);
    if(user === undefined) {
        res.statusMessage = "Utilsateur non trouvé";
        return res.sendStatus(400);
    }
    res.status(200);
    return res.send(user.aventurier.position);
}));

adminRouter.get('/playerTtl', ((req: Request, res: Response) => {
    const id = req.query.id;
    const user = users.find(e => e.aventurier.id === id);
    if(user === undefined) {
        res.statusMessage = "Utilsateur non trouvé";
        return res.sendStatus(400);
    }
    res.status(200);
    res.send({ttl: user.aventurier.ttl});
}));

adminRouter.post('/foundTresor',
    ((req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        console.log(req.body);
        const x = Number.parseFloat(req.body.position.x as string);
        const y = Number.parseFloat(req.body.position.y as string);

        const id = req.body.id;
        const tresor = tresors.find(e => e.position.x === x && e.position.y === y);
        if(tresor === undefined) {
            res.statusMessage = "Coffre n'existe pas"
            return res.sendStatus(400);
        } else if (tresor.isOpen) {
            res.statusMessage = "Coffre déjà ouvert";
            return res.sendStatus(400);
        }
        const user = users.find(e => e.aventurier.id === id);
        if(user === undefined) {
            res.statusMessage = "Utilisateur non trouvé";
            return res.sendStatus(400);
        }
        user.aventurier.tresors.push(tresor);
        tresor.isOpen = true;
        switch(tresor.composition) {
            case "lune":
                user.aventurier.ttl+= 60;
                break;
            case "Bêta-X":
                user.aventurier.ttl = 0;
                break;
            case "dissimulation":
                user.aventurier.ttl = 99999;
            default:
                break;
        }
        res.statusMessage = "Coffre récupéré";
        return res.sendStatus(204);
}));

adminRouter.post('/registerPlayerZZR', ((req: Request, res: Response) => {
    const idPlayer = req.body.id;
    const user = users.find(e => e.aventurier.id === idPlayer);
    if(user !== undefined) {
        user.isRegisterInToZRR = true;
        if(zrrs.length > 0) {
            user.aventurier.position = zrrs[0].limite_SE;
        } else {
            res.status(400);
            return res.send("La zrr n'a pas été crée");
        }
        return res.sendStatus(204);
    }

    return res.sendStatus(400);
}));

export {adminRouter, gameIsStarted}
