import { NextFunction, Request, Response } from "express";
import movementsService from "./service";

const movementsController = {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      res
        .status(200)
        .json(await movementsService.indexByUser(req.user!.id, page, limit));
    } catch (error) {
      next(error);
    }
  },
};

export default movementsController;
