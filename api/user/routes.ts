import userController from "./controller";
import express from "express";
import { auth } from "../../middleware/auth";
import { isAdmin } from "../../middleware/isAdmin";

const userRoutes = express.Router();

const { create, show, index, destroy, update, login, changePassword } =
  userController;

userRoutes.get("/", auth, isAdmin, index);
userRoutes.post("/", create);
userRoutes.get("/me", auth, show);
userRoutes.patch("/me/password", auth, changePassword);
userRoutes.delete("/", auth, destroy);
userRoutes.patch("/", auth, update);
userRoutes.post("/auth", login);

export default userRoutes;
