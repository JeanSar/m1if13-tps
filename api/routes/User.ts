import {Request, Response, Router} from "express";
import {User} from "../Types/types";
import {body, query, validationResult} from "express-validator";
import {CRUDdelete, CRUDgetAll, CRUDgetOne, CRUDupdate, CRUDcreate} from "./genericsCRUD"

const users: User[] = [];
const userRouter = Router();

userRouter.post('/create',
    body("aventurier.image").isString(),
    body("aventurier.ttl").isNumeric(),
    body("aventurier.position.x").isNumeric(),
    body("aventurier.position.y").isNumeric(),
    body("isAdmin").isBoolean(),
    (req: Request, res: Response) => CRUDcreate<User>(users, req, res));


userRouter.get('/getOne',
    query("id").isInt({min: 0, max: users.length - 1}),
    (req: Request, res: Response) => CRUDgetOne<User>(users, req, res));

userRouter.get('/getAll', (req: Request, res: Response) => CRUDgetAll<User>(users, req, res));


userRouter.put('/update', body("aventurier.image").isString(),
    body("aventurier.ttl").isNumeric(),
    body("aventurier.position.x").isNumeric(),
    body("aventurier.position.y").isNumeric(),
    body("isAdmin").isBoolean(),
    query("id").isInt({min: 0, max: users.length - 1}),
    (req: Request, res: Response) => CRUDupdate<User>(users, req, res));


userRouter.delete('/delete',
    query("id").isInt({min: 0, max: users.length - 1}),
    (req: Request, res: Response) => CRUDdelete<User>(users, req, res));

export {users, userRouter};