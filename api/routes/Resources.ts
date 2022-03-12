import { Request, Response, Router } from "express";
import { Georesource } from "../Types/types";
import { body, header, query, validationResult } from "express-validator";
import { CRUDdelete, CRUDgetAll, CRUDgetOne, CRUDupdate, CRUDcreate } from "./genericsCRUD"

const georesources: Georesource[] = [];

const resourcesRouter = Router();
const axios = require('axios').default;

resourcesRouter.get('',
    (req: Request, res: Response) => CRUDgetAll<Georesource>(georesources, req, res));

resourcesRouter.put('/:resourceId',
    header('Authorization').isJWT(),
    header('resourceId').isString(),
    header('position').isArray(),
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        // GET request to spring server
        axios({
            method: 'get',
            url: 'http://localhost:8080/authenticate',
            timeout: 1000,
            params: {
                jwt: req.headers.authorization
            }
        })
            .then(function (res: Response) {
                if(res.status.toString()[0] != "200") {

                } else {
                    return res.sendStatus(200);
                }
            });
    }
);

resourcesRouter.put('/:resourceId/image',
    header('Authorization').isJWT(),
    header('resourceId').isString(),
    header('url').isURL(),
    (req: Request, res: Response) => {
        return res.sendStatus(400);
    });


export { georesources, resourcesRouter };
