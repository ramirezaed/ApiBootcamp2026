import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/HttpError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //  Manejo errores HTTP
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }

  // Manejo de errores de validación de Mongoose (Campos faltantes)
  if (err?.name === "ValidationError") {
    const messages = Object.values(err.errors).map((el: any) => el.message);

    return res.status(400).json({
      error: "Error de validación",
      details: messages,
    });
  }

  // Error inesperado de la aplicacion
  console.error(err);
  return res.status(500).json({ error: "Error interno del servidor" });
};
