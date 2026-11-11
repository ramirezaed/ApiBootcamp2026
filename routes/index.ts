import express from "express";
import userRoutes from "../api/user/routes";
import accountsRoutes from "../api/account/routes";
import movementsRoutes from "../api/movements/routes";
import authRoutes from "../api/auth/routes";

const routes = express.Router();

routes.use("/users", userRoutes);
routes.use("/accounts", accountsRoutes);
routes.use("/movements", movementsRoutes);
routes.use("/auth", authRoutes);

export default routes;
