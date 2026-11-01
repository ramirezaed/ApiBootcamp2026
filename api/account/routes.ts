import express from "express";
import accountsController from "./controller";
import { auth } from "../../middleware/auth";
import { isAdmin } from "../../middleware/isAdmin";
const accountsRoutes = express.Router();

const { index, show, updateAlias, deposit, transfer } = accountsController;

accountsRoutes.get("/", auth, isAdmin, index); //agregar middleware is admin
accountsRoutes.get("/me", auth, show);
accountsRoutes.patch("/alias", auth, updateAlias);
accountsRoutes.patch("/deposit", auth, deposit);
accountsRoutes.patch("/transfer", auth, transfer);

export default accountsRoutes;
