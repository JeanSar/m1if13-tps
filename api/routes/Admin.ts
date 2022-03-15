import {Request, Response, Router} from "express";
import {CRUDcreate} from "./genericsCRUD"
import {zrrs} from "./ZRR";
import {body, query, validationResult} from "express-validator";
import {tresors} from "./Tresor";
import {users} from "./User";
import {Tresor} from "../Types/types";

const adminRouter = Router();


let gameIsStarted: boolean = false;

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
    gameIsStarted = true;
    return res.sendStatus(204);
}));

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
    body('x').isNumeric(),
    body('y').isNumeric(),
    ((req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const x = Number.parseInt(req.body.x as string);
    const y = Number.parseInt(req.body.y as string);
    const tresor = tresors.find(e => e.position.x === x && e.position.y === y); //
    if(tresor === undefined) {
        res.statusMessage = "Coffre n'existe pas"
        return res.sendStatus(400);
    } else if (tresor.composition === "allReadyOpen") {
        res.statusMessage = "Coffre déjà ouvert";
        return res.sendStatus(400);
    }

    tresor.composition = "allReadyOpen";
    res.statusMessage = "Coffre récupéré";
    return res.sendStatus(204);
}));

export {adminRouter, gameIsStarted}
