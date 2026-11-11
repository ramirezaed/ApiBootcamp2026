import { NextFunction, Request, Response } from "express";
import userService from "./service";

const userController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json(await userService.create(req.body));
    } catch (error) {
      next(error);
    }
  },

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      res.status(200).json(await userService.findById(id));
    } catch (error) {
      next(error);
    }
  },

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      res.status(200).json(await userService.index(page, limit));
    } catch (error) {
      next(error);
    }
  },

  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await userService.destroy(req.user!.id));
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await userService.update(req.user!.id, req.body));
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
