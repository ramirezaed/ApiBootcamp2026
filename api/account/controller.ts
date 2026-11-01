import { NextFunction, Request, Response } from "express";
import accountsService from "./service";

const accountsController = {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      res.status(200).json(await accountsService.index(page, limit));
    } catch (error) {
      next(error);
    }
  },

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await accountsService.findByUser(req.user!.id));
    } catch (error) {
      next(error);
    }
  },

  async updateAlias(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(200)
        .json(await accountsService.UpdateAlias(req.user!.id, req.body.alias));
    } catch (error) {
      next(error);
    }
  },
  async deposit(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(200)
        .json(await accountsService.deposit(req.user!.id, req.body.amount));
    } catch (error) {
      next(error);
    }
  },
  async transfer(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(200)
        .json(
          await accountsService.transfer(
            req.user!.id,
            req.body.destination,
            req.body.amount,
          ),
        );
    } catch (error) {
      next(error);
    }
  },
};

export default accountsController;
