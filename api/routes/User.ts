import {Request, Response, Router} from "express";

const userRouter = Router();
const createConroller = (req: Request, res: Response) => {

}
userRouter.post('/create', createConroller);


export default userRouter