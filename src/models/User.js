import Joi from 'joi';

const addressMatcher = (value, helpers) => {
  const [payload] = helpers.state.ancestors;
  const pattern = new RegExp(`(?<![\\w\\d])${payload.username}(?![\\w\\d])`)
  if (!pattern.test(value)) {
    return helpers.message('"message" should contain matching "username" field.');
  }
  return value;
};

const challengeCodeMatcher = (value, helpers) => {
  const [payload] = helpers.state.ancestors;
  const pattern = new RegExp(`(?<![\\w\\d])${payload.challengeCode}(?![\\w\\d])`)
  if (!pattern.test(value)) {
    return helpers.message('"message" should contain matching "challenceCode" field.');
  }
  return value;
};

const validations = {
  user: Joi.object({
    username: Joi.string().alphanum().max(100).required(),
    signature: Joi.string().max(1000).required(),
    message: Joi.string().required().custom(addressMatcher),
    challengeCode: Joi.string().required().custom(challengeCodeMatcher),
  })
};

export { validations };
