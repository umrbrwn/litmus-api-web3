import Joi from 'joi';

const addressMatcher = (value, helpers) => {
  const [payload] = helpers.state.ancestors;
  const pattern = new RegExp(`(?<![\\w\\d])${payload.username}(?![\\w\\d])`)
  if (!pattern.test(value)) {
    return helpers.message('address in the "message" should match "username".');
  }
  return value;
};

const validations = {
  user: Joi.object({
    username: Joi.string().alphanum().max(100).required(),
    signature: Joi.string().max(1000).required(),
    message: Joi.string().required().custom(addressMatcher),
  })
};

export { validations };
