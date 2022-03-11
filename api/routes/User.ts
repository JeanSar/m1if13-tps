import {Request, Response, Router} from "express";
import {User} from "../Types/types";
import {body, validationResult} from "express-validator";

const users: User[] = [];
users.push({aventurier: {image: "test", ttl: 0, position: {x: 0, y: 0}}, isAdmin: false});
const userRouter = Router();


const createController = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    users.push(req.body);
    return res.sendStatus(204);
}

userRouter.post('/create',
    body("aventurier.image").isString(),
    body("aventurier.ttl").isNumeric(),
    body("aventurier.position.x").isNumeric(),
    body("aventurier.position.y").isNumeric(),
    body("isAdmin").isBoolean(),
    createController);

const getOneController = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const id: number = req.body.id;
}
userRouter.get('/getOne', body("id").isNumeric(), getOneController);


const getAllController = (req: Request, res: Response) => {
    res.send(users);
}
userRouter.get('/getAll', getAllController);

export default userRouter;