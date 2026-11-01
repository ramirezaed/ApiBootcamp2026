import express from "express";
import userRoutes from "../api/user/routes";
import accountsRoutes from "../api/account/routes";

const routes = express.Router();

routes.use("/users", userRoutes);
routes.use("/accounts", accountsRoutes);

export default routes;
