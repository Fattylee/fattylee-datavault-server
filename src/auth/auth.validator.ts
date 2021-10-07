import { NextFunction, Request, Response } from "express";
import Joi, { ValidationError, Schema } from "joi";

const config = Joi.object().options({
  abortEarly: false,
  stripUnknown: true,
  errors: {
    wrap: {
      label: false,
    },
  },
});

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

const getErrorObj = (error: ValidationError) =>
  error.details.reduce((prevValue: any, err) => {
    prevValue[err.path[0]] = err.message;
    return prevValue;
  }, {});

const createErrorMiddleware =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);

    if (error) return res.status(400).json(getErrorObj(error));

    req.body = { ...req.body, ...value };
    next();
  };

const signupValidator = createErrorMiddleware(registerSchema);
const loginValidator = createErrorMiddleware(loginSchema);

export { signupValidator, loginValidator };
