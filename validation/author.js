import Joi from '@hapi/joi';

export const createAuthorValidator = Joi.object({
   fullName: Joi.string().required().label('Name and Family'),
   email: Joi.string().email().required().label('Email'),
   password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,30}$/).label('Password').messages({
      "any.regex": "Enter a password between 6 and 20 characters and it should contains letter and number"
   }),
   username: Joi.string().required().alphanum().label('Username')
});
export const loginValidator = Joi.object({
   email: Joi.string().email().required().label('Email'),
   password: Joi.string().required().min(6).max(30).label('Password')
});