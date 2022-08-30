import { dbcontext } from '../modules/db.js';

class Secret {
  static getRandomSecret() {
    return dbcontext.$queryRaw`SELECT * FROM public."Secretes" ORDER BY random() LIMIT 1`;
  }
}

export { Secret as default };
