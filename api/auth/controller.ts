import { NextFunction, Request, Response } from "express";
import authService from "./service";
import { auth } from "../../middleware/auth";

const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await authService.login(req.body));
    } catch (error) {
      next(error);
    }
  },
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(200)
        .json(
          await authService.changePassword(
            req.user!.id,
            req.body.currentPassword,
            req.body.newPassword,
          ),
        );
    } catch (error) {
      next(error);
    }
  },
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await authService.findById(req.user!.id));
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
