import { Request, Response, Router } from "express";
import { Limites, Position } from "../Types/types";
import { body, query, validationResult } from "express-validator";
import {CRUDdelete, CRUDgetAll, CRUDgetOne, CRUDupdate, CRUDcreate} from "./genericsCRUD"



const zrrs: Limites[] = []
zrrs.push({
    limite_NE: { x: 45, y: 56 },
    limite_NO: { x: 45, y: 56 },
    limite_SE: { x: 45, y: 56 },
    limite_SO: { x: 45, y: 56 }
});

const zrrRouter = Router();

/*const idValidator = (value: any) => {
    value.isInt({min: 0});
    const id = Number.parseInt(value as string);
}*/

const createController = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    let newid = zrrs.push(req.body);
    res.status(201);
    res.send(`L'objet nouvellement créé a pour id : ${newid - 1}`);
}
zrrRouter.post('/create',
    body("limite_NE.x").isNumeric(),
    body("limite_NE.y").isNumeric(),
    body("limite_NO.x").isNumeric(),
    body("limite_NO.y").isNumeric(),
    body("limite_SE.x").isNumeric(),
    body("limite_SE.y").isNumeric(),
    body("limite_SO.x").isNumeric(),
    body("limite_SO.y").isNumeric(),
    (req: Request, res: Response) => CRUDcreate<Limites>(zrrs, req, res)
);

// Récupération d'un élément de zrrs via /getOne
const getOneController = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const id = Number.parseInt(req.query.id as string);
    res.status(200);
    return res.send(zrrs[id]);
};
zrrRouter.get('/getOne', 
    query("id").isInt({min: 0}),
    (req: Request, res: Response) => CRUDgetOne<Limites>(zrrs, req, res)
);

// Récupération de tout les éléments de zrrs via /getAll
zrrRouter.get('/getAll',
    (req: Request, res: Response) => CRUDgetAll<Limites>(zrrs, req, res)
);

// Mise à jour d'une donnée via /update
const updateController = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const id = Number.parseInt(req.query.id as string);

    zrrs[id] = req.body;
    return res.sendStatus(204);
};
zrrRouter.put('/update',
    body("limite_NE.x").isNumeric(),
    body("limite_NE.y").isNumeric(),
    body("limite_NO.x").isNumeric(),
    body("limite_NO.y").isNumeric(),
    body("limite_SE.x").isNumeric(),
    body("limite_SE.y").isNumeric(),
    body("limite_SO.x").isNumeric(),
    body("limite_SO.y").isNumeric(),
    query("id").isInt({min: 0}), 
    (req: Request, res: Response) => CRUDupdate<Limites>(zrrs, req, res)
);

const deleteController = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const id = Number.parseInt(req.query.id as string);
    zrrs.splice(id);
    res.sendStatus(204);
};
zrrRouter.delete('/delete', 
    query("id").isInt({min: 0}), 
    (req: Request, res: Response) => CRUDdelete<Limites>(zrrs, req, res)
);

export default zrrRouter;