import {Request, Response, Router} from "express";
import {User, Position, Aventurier} from "../Types/types";


const userRouter = Router();
const createConroller = (req: Request, res: Response) => {

}
userRouter.post('/create', createConroller);


export default userRouter