import { request, Request, Response, Router } from "express";
import { Limites, Position } from "../Types/types";

const zrrs: Limites[] = []

zrrs.push({
    limite_NE:{x:45, y:56},
    limite_NO:{x:45, y:56},
    limite_SE:{x:45, y:56},
    limite_SO:{x:45, y:56}
});


const zrrRouter = Router();

zrrRouter.post('/create', (req: Request, res: Response) => {
    console.log(req.body);
    res.sendStatus(204);
});

zrrRouter.get('/getOne', (req: Request, res: Response) => {
    req.query.id;
    res.status(200);
    res.send(zrrs[0]);
});

zrrRouter.get('/getAll', (req: Request, res: Response) => {
    res.status(200);
    res.send(zrrs);
});

zrrRouter.put('/update', (req: Request, res: Response) => {

});

zrrRouter.delete('/delete', (req: Request, res: Response) => {

});

export default zrrRouter