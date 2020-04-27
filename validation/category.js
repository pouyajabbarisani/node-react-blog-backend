import Joi from '@hapi/joi';

export const createCategoryValidator = Joi.object({
   title: Joi.string().required().label('Title'),
   slug: Joi.string().alphanum().required().label('Slug')
});
export const editCategoryValidator = Joi.object({
   title: Joi.string().label('Title'),
   slug: Joi.string().alphanum().label('Slug')
});