import { validationResult } from "express-validator";

export const validarCampos = (req, res, next) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    const error = new Error('Validation failed');
    error.status = 400;
    error.errors = e.array();
    return next(error);
  }

  next();
};