import Joi from '@hapi/joi';

export const createPostValidator = Joi.object({
   slug: Joi.string().required().label('Slug'),
   title: Joi.string().required().label('Title'),
   content: Joi.string().required().label('Content'),
   categories: Joi.array().items(Joi.string()).label('Categories'),
   featuredImage: Joi.string().label('Featured image')
});
export const editPostValidator = Joi.object({
   slug: Joi.string().required().label('Slug'),
   updatedSlug: Joi.string().label('Edited slug'),
   updatedTitle: Joi.string().label('Edited title'),
   updatedContent: Joi.string().label('Edited content'),
   updatedCategories: Joi.array().items(Joi.string()).label('Edited categories'),
   updatedFeaturedImage: Joi.string().label('Edited featured image')
});