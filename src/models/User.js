import Joi from 'joi';
import { dbcontext } from '../modules/db.js';

const validations = {
  newUser: Joi.object({
    username: Joi.string().alphanum().min(3).max(100).required(),
    password: Joi.string().min(6).max(65).required()
  })
};

class User {
  static findByUsername(username) {
    return dbcontext.users.findFirst({ where: { username } });
  }

  static createUser(user) {
    return dbcontext.users.create({
      data: {
        username: user.username,
        passwordHash: user.passwordHash,
        salt: user.salt,
        failedLoginCount: 0
      }
    });
  }

  // For now we are only incrementing, we don't really need this
  // in real world scenario this should have a max failed count limit
  // and after that user account should be locked for a time period
  static async countLoginFailed(username) {
    const user = await User.findByUsername(username);
    return dbcontext.users.update({
      where: { userId: user.userId },
      data: { failedLoginCount: user.failedLoginCount + 1 }
    })
  }
}

export { User as default, validations };
