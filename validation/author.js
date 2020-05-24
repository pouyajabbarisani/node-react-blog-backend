import Joi from '@hapi/joi';

export const createAuthorValidator = Joi.object({
   fullName: Joi.string().required().label('Name and Family'),
   email: Joi.string().email().required().label('Email'),
   password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*\d).{6,30}$/).label('Password').messages({
      "string.pattern.base": "Password lengths should between 6 and 30 with letter and number",
   }),
   username: Joi.string().required().alphanum().label('Username')
});
export const loginValidator = Joi.object({
   email: Joi.string().email().required().label('Email'),
   password: Joi.string().required().min(6).max(30).label('Password')
});
export const deleteAuthorValidator = Joi.object({
   username: Joi.string().required().label('Username')
})