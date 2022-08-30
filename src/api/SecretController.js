import Secret from '../models/Secret.js';

export default class SecretController {
  static async getRandomSecret(req, res, next) {
    try {
      const secret = await Secret.getRandomSecret();
      const [{ message }] = secret;
      res.json({ message });
    } catch (err) {
      next(err);
    }
  };
}
