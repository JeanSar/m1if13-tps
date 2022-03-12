import {Tresor} from "../Types/types";
import {Request, Response, Router} from "express";
import {CRUDdelete, CRUDgetAll, CRUDgetOne, CRUDupdate, CRUDcreate} from "./genericsCRUD"

const tresors: Tresor[] = [];
const tresorRouter = Router();

tresorRouter.post('/create',(req: Request, res: Response) => CRUDcreate<Tresor>(tresors, req, res));
tresorRouter.get('/getOne',(req: Request, res: Response) => CRUDgetOne<Tresor>(tresors, req, res));
tresorRouter.get('/getAll', (req: Request, res: Response) => CRUDgetAll<Tresor>(tresors, req, res));
tresorRouter.put('/update',(req: Request, res: Response) => CRUDupdate<Tresor>(tresors, req, res));
tresorRouter.delete('/delete',(req: Request, res: Response) => CRUDdelete<Tresor>(tresors, req, res));

export {tresorRouter, tresors};