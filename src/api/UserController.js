import { signin, signup } from '../modules/auth.js';

export default class UserController {
  static async trySignin(req, res, next) {
    const { username, password } = req.body;
    // if the user exist then log them in, otherwise create their account
    try {
      const result = await signin(username, password);
      res.json({ token: result });
      return next();
    } catch (err) {
      if (err.status !== 404) {
        return next(err);
      }
    }
    try {
      await signup(username, password);
      res.status(201).send();
    } catch (err) {
      next(err);
    }
  };
}
