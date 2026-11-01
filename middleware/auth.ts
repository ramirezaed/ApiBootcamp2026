import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../errors/HttpError";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "No autorizado: falta el header Bearer"));
  }
  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET!) as {
      _id: string;
      isAdmin: boolean;
    };
    req.user = { id: payload._id, isAdmin: payload.isAdmin };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(
        new HttpError(401, "Tu sesión ha expirado. Vuelve a iniciar sesión"),
      );
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new HttpError(401, "Token invalido"));
    }
    next(err);
  }
};
