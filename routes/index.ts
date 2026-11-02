import express from "express";
import userRoutes from "../api/user/routes";
import accountsRoutes from "../api/account/routes";
import movementsRoutes from "../api/movements/routes";

const routes = express.Router();

routes.use("/users", userRoutes);
routes.use("/accounts", accountsRoutes);
routes.use("/movements", movementsRoutes);

export default routes;
