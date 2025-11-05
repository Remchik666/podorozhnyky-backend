import Joi from "joi";

export const createStorySchema = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters long",
    "any.required": "Title is required",
  }),
  description: Joi.string().min(3).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 3 characters long",
    "any.required": "Description is required",
  }),
  image: Joi.string().uri().allow("").messages({
    "string.uri": "Image must be a valid URL",
  }),
  location: Joi.string().max(200).allow("").messages({
    "string.max": "Location must be no longer than 200 characters",
  }),
});

export const updateStorySchema = Joi.object({
  title: Joi.string().min(3).max(200).messages({
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title must be no longer than 200 characters",
  }),
  description: Joi.string().min(3).messages({
    "string.min": "Description must be at least 3 characters long",
  }),
  image: Joi.string().uri().allow("").messages({
    "string.uri": "Image must be a valid URL",
  }),
  location: Joi.string().max(200).allow("").messages({
    "string.max": "Location must be no longer than 200 characters",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });
