import Joi from '@hapi/joi';

export const createCategoryValidator = Joi.object({
   title: Joi.string().required().label('Title'),
   slug: Joi.string().required().label('Slug')
});
export const editCategoryValidator = Joi.object({
   slug: Joi.string().required().label('Slug'),
   updatedTitle: Joi.string().label('Edited title'),
   updatedSlug: Joi.string().label('Edited slug')
});
export const deleteCategoryValidator = Joi.object({
   slug: Joi.string().required().label('Slug')
})