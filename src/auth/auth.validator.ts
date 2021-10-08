import Joi from "joi";
import { config, createErrorMiddleware } from "../app/app.validator";

const loginSchema = config.keys({
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().min(6).required(),
});

const registerSchema = loginSchema.keys({
  firstName: Joi.string()
    .min(2)
    .max(30)
    .required()
    .trim()
    .lowercase()
    .label("First name"),
  lastName: Joi.string()
    .min(2)
    .max(30)
    .required()
    .trim()
    .lowercase()
    .label("Last name"),
});

const signupValidator = createErrorMiddleware(registerSchema);
const loginValidator = createErrorMiddleware(loginSchema);

export { signupValidator, loginValidator };
