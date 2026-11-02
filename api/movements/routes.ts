import express from "express";
import { auth } from "../../middleware/auth";
import movementsController from "./controller";

const movementsRoutes = express.Router();

const { index } = movementsController;

movementsRoutes.get("/me", auth, index);

export default movementsRoutes;
