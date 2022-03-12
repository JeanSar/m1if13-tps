import {Response, Request} from "express/ts4.0";
import path from 'path'
import express from 'express';
import userRouter from "./routes/User";
import zrrRouter from './routes/ZRR';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use('/user', userRouter);
app.use('/zrr', zrrRouter);


// Après toutes nos routes car si on le met avant, ce code sera appelé avant nos routes et on aura donc tout le temps
// une 404
app.use((req: Request, res: Response, next) => {
    res.status(404).render("notfound");
});

app.listen(3376);
