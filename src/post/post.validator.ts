import Joi from "joi";
import { config, createErrorMiddleware } from "../app/app.validator";

const createPostSchema = config.keys({
  message: Joi.string().max(200).required(),
});

const createPostValidator = createErrorMiddleware(createPostSchema);

export { createPostValidator };
