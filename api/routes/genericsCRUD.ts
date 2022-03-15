import {Request, Response} from "express";
import {validationResult} from "express-validator";

export function CRUDcreate<T>(tab: T[], req: Request, res: Response) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    tab.push(req.body as T);
    res.status(201);
    return res.send(`L'objet nouvellement créé a pour indice (ATTENTION !! c'est juste l'indice du tableau): ${tab.indexOf(req.body)}`);
}

export function CRUDupdate<T>(tab: T[], req: Request, res: Response) {
    const errors = validationResult(req);
    const id = Number.parseInt(req.query.id as string);
    if(!errors.isEmpty() || id > tab.length - 1) {
        return res.status(400).json({errors: errors.array()})
    }

    tab[id] = req.body;
    return res.sendStatus(204);
}

export function CRUDgetOne<T>(tab: T[], req: Request, res: Response) {
    const errors = validationResult(req);
    const id = Number.parseInt(req.query.id as string);

    if(!errors.isEmpty() || id > tab.length - 1) {
        return res.status(400).json({errors: errors.array()})
    }
    res.status(200);
    return res.send(tab[id]);
}

export function CRUDgetAll<T>(tab: T[], req: Request, res: Response) {
    return res.send(tab);
}

export function CRUDdelete<T>(tab: T[], req: Request, res: Response) {
    const errors = validationResult(req);
    const id = Number.parseInt(req.query.id as string);
    if(!errors.isEmpty() || id > tab.length - 1) {
        return res.status(400).json({errors: errors.array()})
    }
    tab.splice(id, 1);
    res.statusMessage = "Delete ok";
    return res.sendStatus(204);
}