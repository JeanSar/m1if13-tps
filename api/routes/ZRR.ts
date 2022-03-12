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

// Création d'un élément de zrr via /create
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

// Récupération d'un élément de zrr via /getOne
zrrRouter.get('/getOne', 
    query("id").isInt({min: 0}),
    (req: Request, res: Response) => CRUDgetOne<Limites>(zrrs, req, res)
);

// Récupération de tout les éléments de zrrs via /getAll
zrrRouter.get('/getAll',
    (req: Request, res: Response) => CRUDgetAll<Limites>(zrrs, req, res)
);

// Mise à jour d'une donnée via /update
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

// Suppression d'un élément
zrrRouter.delete('/delete', 
    query("id").isInt({min: 0}), 
    (req: Request, res: Response) => CRUDdelete<Limites>(zrrs, req, res)
);

export {zrrRouter, zrrs};