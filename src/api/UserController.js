import { signin } from '../modules/auth.js';

export default class UserController {
  static async signin(req, res, next) {
    const { username, message, signature } = req.body;
    try {
      const result = await signin(username, message, signature);
      res.json({ token: result });
    } catch (err) {
      next(err);
    }
  };
}
