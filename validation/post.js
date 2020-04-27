import Joi from '@hapi/joi';

export const createPostValidator = Joi.object({
   slug: Joi.string().required().alphanum().label('Slug'),
   title: Joi.string().required().label('Title'),
   content: Joi.string().required().label('Content'),
   categories: Joi.array().items(Joi.string().alphanum()).label('Categories'),
   featuredImage: Joi.string().label('Featured image')
});
export const editPostValidator = Joi.object({
   updatedSlug: Joi.string().alphanum().label('Slug'),
   updatedTitle: Joi.string().label('Title'),
   updatedContent: Joi.string().label('Content'),
   updatedCategories: Joi.array().items(Joi.string().alphanum()).label('Categories'),
   updatedFeaturedImage: Joi.string().label('Featured image')
});