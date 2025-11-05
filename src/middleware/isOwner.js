import createHttpError from "http-errors";

export const isOwner = (Model, idParam = "id", ownerField = "author") => {
  return async (req, res, next) => {
    const resourceId = req.params[idParam];

    const resource = await Model.findById(resourceId);
    if (!resource) {
      return next(createHttpError(404, "Resource not found"));
    }

    if (resource[ownerField].toString() !== req.user._id.toString()) {
      return next(createHttpError(403, "Access denied"));
    }
    req.resource = resource;
    next();
  };
};
