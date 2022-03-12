import { Request, Response, Router } from "express";
import { Limites, Aventurier, Tresor } from "../Types/types";
import { body, query, validationResult } from "express-validator";
import {CRUDdelete, CRUDgetAll, CRUDgetOne, CRUDupdate, CRUDcreate} from "./genericsCRUD"

const resourcesRouter = Router();

export {resourcesRouter};
