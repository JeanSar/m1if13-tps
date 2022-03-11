import {Request, Response, Router} from "express";

interface Position {
    x: number,
    y: number
}

interface Aventurier {
    image: string,
    position: Position,
    ttl: number
}

interface User {
    aventurier: Aventurier,
    isAdmin: boolean
}

const userRouter = Router();
const createConroller = (req: Request, res: Response) => {

}
userRouter.post('/create', createConroller);


export default userRouter