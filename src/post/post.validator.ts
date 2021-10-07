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

const createPostSchema = config.keys({
  message: Joi.string().max(200).required(),
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

const createPostValidator = createErrorMiddleware(createPostSchema);

export { createPostValidator };
