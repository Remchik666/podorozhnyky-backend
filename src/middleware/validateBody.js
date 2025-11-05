import createHttpError from "http-errors";

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return next(createHttpError(400, messages.join(", ")));
    }
    next();
  };
};
