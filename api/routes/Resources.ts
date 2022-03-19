import {NextFunction, Request, Response, Router} from "express";
import {convertToGeoResource, Georesource} from "../Types/types";
import {body, header, param, query, validationResult} from "express-validator";
import { CRUDdelete, CRUDgetAll, CRUDgetOne, CRUDupdate, CRUDcreate } from "./genericsCRUD"
import {users} from "./User";
import {tresors} from "./Tresor";

// TODO - Middleware pour l'auth

const resourcesRouter = Router();
const axios = require('axios');

const origin = "http://localhost"

const notFoudRessourceIdMsg = "L'id spécifié n'existe pas ou l'utilsateur n'est pas inscrit à la ZRR";

resourcesRouter.use(async (req: Request, res: Response, next: NextFunction) => {
    if(!(req.headers['x-admin-authorization'] == 'true')) { // Ce header est mis si l'on reqûete depuis la page admin
        const jwt_token = req.headers.authorization;
        try {
            const response = await axios.get(`http://localhost:8080/authenticate?jwt=${jwt_token}&origin=${origin}`);
            res.status(response.status);
            next();
        } catch (e) {
            return res.sendStatus(401); // Non authentifié
        }
    } else { // C'est que la requête vien de la page admin
        next();
    }

});

resourcesRouter.get('/:resourceId',
    param('user').isString(),
    (req: Request, res: Response) => {
        const resourceId: string = req.params.resourceId;
        const user = users.find(e => e.aventurier.id === resourceId && e.isRegisterInToZRR);
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
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }


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
        const resourceId: string = req.params.resourceId;

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
});
export { resourcesRouter };
