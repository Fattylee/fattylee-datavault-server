import { NextFunction, Request, Response } from "express";
import Joi, { ValidationError, Schema } from "joi";

export const config = Joi.object().options({
  abortEarly: false,
  stripUnknown: true,
  errors: {
    wrap: {
      label: false,
    },
  },
});

const getErrorObj = (error: ValidationError) =>
  error.details.reduce((prevValue: any, err) => {
    prevValue[err.path[0]] = err.message;
    return prevValue;
  }, {});

export const createErrorMiddleware =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);

    if (error) return res.status(400).json(getErrorObj(error));

    req.body = { ...req.body, ...value };
    next();
  };
