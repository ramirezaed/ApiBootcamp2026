import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/HttpError";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return next(new HttpError(403, "No tenés permisos de administrador"));
  }
  next();
};
