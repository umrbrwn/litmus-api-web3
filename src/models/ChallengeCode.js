import { DateTime } from 'luxon';
import { dbcontext } from '../modules/db.js';

class ChallengeCode {
  static findUnused(address) {
    return dbcontext.challengeCodes.findFirst({
      where: {
        requester: address,
        usedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static create(address, code) {
    return dbcontext.challengeCodes.create({
      data: {
        requester: address,
        challenge: code
      }
    });
  }

  static use(address, code) {
    return dbcontext.challengeCodes.updateMany({
      where: { requester: address, challenge: code },
      data: { usedAt: DateTime.utc().toJSDate() }
    })
  }

  static delete(challengeCodeId) {
    return dbcontext.challengeCodes.delete({ where: { challengeCodeId } });
  }
}

export { ChallengeCode as default };
