const Joi = require('joi');

const templateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .pattern(/^[a-zA-Z0-9\s-]+$/)
    .messages({
      'string.pattern.base': 'Name can only contain letters, numbers, spaces, and hyphens'
    }),

  category: Joi.string()
    .valid('nextjs', 'reactjs', 'vuejs', 'angular', 'other')
    .required(),

  description: Joi.string()
    .min(50)
    .max(1000)
    .required(),

  price: Joi.number()
    .min(0)
    .max(1000)
    .required(),

  type: Joi.string()
    .valid('free', 'paid')
    .required(),

  downloadUrl: Joi.string()
    .uri()
    .required(),

  thumbnailUrl: Joi.string()
    .uri()
    .optional(),

  features: Joi.array()
    .items(Joi.string().max(100))
    .min(1)
    .max(20),

  tags: Joi.array()
    .items(Joi.string().max(20))
    .min(1)
    .max(10),

  compatibility: Joi.object({
    frameworks: Joi.array().items(Joi.string()),
    browsers: Joi.array().items(Joi.string()),
    nodeVersion: Joi.string()
  }),

  isFeatured: Joi.boolean(),
  isPromotional: Joi.boolean()
});

exports.validateTemplate = (data, isUpdate = false) => {
  const schema = isUpdate ? templateSchema.fork(
    ['name', 'category', 'description', 'price', 'type', 'downloadUrl'],
    (schema) => schema.optional()
  ) : templateSchema;

  return schema.validate(data, { abortEarly: false });
};