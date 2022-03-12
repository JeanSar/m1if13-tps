import {Request, Response, Router} from "express";
import {User} from "../Types/types";
import {body, query, validationResult} from "express-validator";

let users: User[] = [];
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
    const id = Number.parseInt(req.query.id as string);

    if(users.length - 1 < id && id > -1) {
      return res.sendStatus(400);
    }
    res.status(200);
    return res.send(users[id]);
}
userRouter.get('/getOne', query("id").isNumeric(), getOneController);


const getAllController = (req: Request, res: Response) => {
    res.send(users);
}
userRouter.get('/getAll', getAllController);

const updateController = (req: Request, res: Response) => {
    const id = Number.parseInt(req.query.id as string);
    console.log(id)
    if(users.length - 1 < id && id > -1) {
        return res.sendStatus(400);
    }
    users[id] = req.body;
    return res.sendStatus(204);
}
userRouter.put('/update', body("aventurier.image").isString(),
    body("aventurier.ttl").isNumeric(),
    body("aventurier.position.x").isNumeric(),
    body("aventurier.position.y").isNumeric(),
    body("isAdmin").isBoolean(),
    query("id").isNumeric(),
    updateController);


export default userRouter;