import { request, Request, Response, Router } from "express";
import { Limites, Position } from "../Types/types";
import { body, query, validationResult } from "express-validator";


const zrrs: Limites[] = []

zrrs.push({
    limite_NE: { x: 45, y: 56 },
    limite_NO: { x: 45, y: 56 },
    limite_SE: { x: 45, y: 56 },
    limite_SO: { x: 45, y: 56 }
});


const zrrRouter = Router();

const createController = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const newid = zrrs.push(req.body);
    res.status(201);
    res.send(`L'objet nouvellement créé a pour id : ${newid}`)
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
    createController
);

// Récupération d'un élément de zrrs via /getOne
const getOneController = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const id = Number.parseInt(req.query.id as string);

    if (zrrs.length - 1 < id && id > -1) {
        return res.sendStatus(400);
    }
    res.status(200);
    return res.send(zrrs[id]);
};
zrrRouter.get('/getOne', query("id").isNumeric(), getOneController);

// Récupération de tout les éléments de zrrs via /getAll
zrrRouter.get('/getAll', (req: Request, res: Response) => {
    res.status(200);
    res.send(zrrs);
});

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
    query("id").isNumeric(), 
    updateController);

const deleteController = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const id = Number.parseInt(req.query.id as string);
    if(zrrs.length <= id)  {
        return res.sendStatus(400);
    }
    zrrs.splice(id);
    res.sendStatus(204);
};
zrrRouter.delete('/delete', query("id").isNumeric(), deleteController);

export default zrrRouter;