import { check } from "express-validator";
import { validarCampos } from "./validate-values.js";
import { existeEmail } from "../helpers/db-validators.js";

export const registerValidator = [
  check("name", "El nombre es obligatorio").not().isEmpty(),
  check("surname", "El apellido es obligatorio").not().isEmpty(),
  check("username", "El username es obligatorio").not().isEmpty(),
  check("email", "El correo electrónico").isEmail(),
  check("email").custom(existeEmail),
  check("password", "El password debe de ser mayor a 6 caracteres").isLength({
    min: 6,
  }),
  validarCampos,
];

export const loginValidator = [
  check("email").optional().isEmail().withMessage("Ingrese una dirección válida"),
  check("username").optional().isString().withMessage("Username inválido"),
  check("password", "Password debe de tener al menos 6 caracteres").isLength({
    min: 6,
  }),
  validarCampos,
];