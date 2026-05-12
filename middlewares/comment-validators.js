import { check } from "express-validator";
import { validarCampos } from "./validate-values.js";
import { validateJWT } from "./verify-jwt.js";
import { authtenticatedLimiter } from "./request-limit.js";
import { existePost, existeComment, isCommentOwner } from "../helpers/db-validators.js";

export const createCommentValidator = [
  validateJWT,
  authtenticatedLimiter,
  check("text", "El texto del comentario es obligatorio").not().isEmpty(),
  check("text", "El comentario debe tener máximo 500 caracteres").isLength({ max: 500 }),
  check("post", "El ID del post es obligatorio").not().isEmpty(),
  check("post", "El ID del post debe ser un ObjectId válido").isMongoId(),
  check("post").custom(existePost),
  validarCampos,
];
