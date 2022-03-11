import { Request, Response, Router } from "express";
import { Limites, Position } from "../Types/types";

const zrrs: Limites[] = []

const zrrRouter = Router();

zrrRouter.post('/create', (req: Request, res: Response) => {
    console.log(req.body);
    res.sendStatus(204);
});

zrrRouter.get('/getOne', (req: Request, res: Response) => {
    res.sendStatus(200);
});

zrrRouter.get('/getAll', (req: Request, res: Response) => {
    res.sendStatus(200);
});

zrrRouter.put('/update', (req: Request, res: Response) => {

});

zrrRouter.delete('/delete', (req: Request, res: Response) => {

});

export default zrrRouter