import { Request, Response, Router } from "express";
import {convertToGeoResource, Georesource} from "../Types/types";
import {body, header, param, query, validationResult} from "express-validator";
import { CRUDdelete, CRUDgetAll, CRUDgetOne, CRUDupdate, CRUDcreate } from "./genericsCRUD"
import {users} from "./User";
import {tresors} from "./Tresor";

const georesources: Georesource[] = [];

const resourcesRouter = Router();
const axios = require('axios');

const origin = "http://localhost"

const notFoudRessourceIdMsg = "L'id spécifié n'existe pas";
const failAuthMesg = ""

resourcesRouter.get('/:resourceId',
    param('user').isString(),
    (req: Request, res: Response) => {
        const resourceId: string = req.params.resourceId;
        const user = users.find(e => e.aventurier.id === resourceId);
        if(user === undefined) {
            res.status(400);
            return res.send(notFoudRessourceIdMsg);
        }
        res.status(200);
        const resource: Georesource = convertToGeoResource(users, tresors, resourceId) as Georesource;
        return res.send(resource);
    });

resourcesRouter.put('/:resourceId',
    header('Authorization').isJWT(),
    param('resourceId').isString(),
    body('position.x').isNumeric(),
    body('position.y').isNumeric(),
    async (req: Request, res: Response) => {
        const resourceId = req.params.resourceId;
        const newPosition = req.body.position;


        const jwt_token = req.headers.authorization;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        let status: number;
        try {
            const response = await axios.get(`http://localhost:8080/authenticate?jwt=${jwt_token}&origin=${origin}`);
            status = response.status;
        } catch (e) {
            status = -1;
        }

        // L'authentification s'est bien passée
        if(status === 204) {
            const user = users.find(e => e.aventurier.id === resourceId);
            if (user != undefined) {
                // L'id fournit dans le body existe bien
                user.aventurier.position = newPosition;
                res.status(200)
                return res.send("Position modifié");
            } else {
                // Aucun id ne corespond à celui fournit
                res.status(400);
                return res.send(notFoudRessourceIdMsg);
            }
        }
        // A partir d'ici, si on atteint le code ci-dessous, c'est que l'authentification via le serveur spring a échoué
        res.status(400)
        return res.send(notFoudRessourceIdMsg);

        // GET request to spring server
        // axios({
        //     method: 'get',
        //     url: 'http://localhost:8080/authenticate',
        //     params: {
        //         jwt: req.headers.authorization
        //     }
        // })
        //     .then(function (res: Response) {
        //         if(res.status.toString()[0] != "200") {
        //             return res.sendStatus(401);
        //         } else {
        //             return res.sendStatus(200);
        //         }
        //     });
    }
);

resourcesRouter.put('/:resourceId/image',
    header('Authorization').isJWT(),
    param('resourceId').isString(),
    body('url').isURL(),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const newImage: string = req.body.url;
        const jwt_token: string = req.headers.authorization as string;
        const resourceId: string = req.params.resourceId;

        let status: number;
        try {
            const response = await axios.get(`http://localhost:8080/authenticate?jwt=${jwt_token}&origin=${origin}`);
            status = response.status;
        } catch (e) {
            status = -1;
        }

        // L'authentification s'est bien passée
        if(status === 204) {
            const user = users.find(e => e.aventurier.id === resourceId);
            if (user != undefined) {
                // L'id fournit dans le body existe bien
                user.aventurier.image = newImage;
                res.status(200)
                return res.send("Image modifié");
            } else {
                // Aucun id ne corespond à celui fournit
                res.status(400);
                return res.send(notFoudRessourceIdMsg);
            }
        }
        // A partir d'ici, si on atteint le code ci-dessous, c'est que l'authentification via le serveur spring a échoué
        res.status(400)
        return res.send(notFoudRessourceIdMsg);

        // GET request to spring server
    //     axios({
    //         method: 'get',
    //         url: 'http://localhost:8080/authenticate',
    //         timeout: 1000,
    //         params: {
    //             jwt: req.headers.authorization
    //         }
    //     })
    //         .then(function (res: Response) {
    //             if(res.status.toString()[0] != "200") {
    //                 return res.sendStatus(401);
    //             } else {
    //                 return res.sendStatus(200);
    //             }
    //         });
});
export { georesources, resourcesRouter };