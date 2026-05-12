import { check } from "express-validator";
import { validarCampos } from "./validate-values.js";
import { validateJWT } from "./verify-jwt.js";
import { authtenticatedLimiter, publicLimiter } from "./request-limit.js";
import { existePost } from "../helpers/db-validators.js"; // Importa solo la función de existencia

export const createPostValidator = [
  validateJWT,
  authtenticatedLimiter,
  check("title", "El título es obligatorio").not().isEmpty(),
  check("title", "El título debe tener máximo 100 caracteres").isLength({ max: 100 }),
  check("content", "El contenido es obligatorio").not().isEmpty(),
  validarCampos
];

export const getPostValidator = [
  publicLimiter,
  check("id", "El ID del post es obligatorio").not().isEmpty(),
  check("id", "El ID debe ser un ObjectId válido").isMongoId(),
  check("id").custom(existePost),
  validarCampos
];