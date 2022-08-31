import { takeChallengeCode, signin } from '../modules/auth.js';

export default class UserController {
  static async takeChallengeCode(req, res, next) {
    const { address } = req.body;
    try {
      const challengeCode = await takeChallengeCode(address);
      res.json({ challengeCode });
    } catch (err) {
      next(err);
    }
  }

  static async signin(req, res, next) {
    const { username, message, signature, challengeCode } = req.body;
    try {
      const result = await signin(username, message, signature, challengeCode);
      res.json({ token: result });
    } catch (err) {
      next(err);
    }
  };
}
