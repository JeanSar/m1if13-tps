import {Response, Request} from "express/ts4.0";
import express from 'express';

const app = express();

app.use(express.static("public"));


app.get("/", (req: Request, res: Response) => {
    res.send("Hello worddld !!!!");
});

app.listen(3000);
