import UserController from './UserController.js';
import SecretController from './SecretController.js';
import { passport } from '../modules/auth.js';

export function setup(app, router) {
  router.post(
    '/api/v1/signin',
    UserController.signin
  );

  router.get(
    '/api/v1/secret',
    passport.authenticate('bearer', { session: false }),
    SecretController.getRandomSecret
  );

  app.use(router);
}
