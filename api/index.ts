import {Response, Request} from "express/ts4.0";
const express  = require('express');

const app = express();

app.use(express.static("public"));


app.get("/", (req: Request, res: Response) => {
    res.send("Hello world !!!!");
});

app.listen(3000);
