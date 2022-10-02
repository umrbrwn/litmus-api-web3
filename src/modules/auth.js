import fs from 'fs';
import { cryptoWaitReady, decodeAddress, signatureVerify } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import passport from 'passport';
import passportBearer from 'passport-http-bearer';
import jwt from 'jsonwebtoken';
import { DateTime, Interval } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

import { CustomError, ServerError } from './error.js';
import { validations } from '../models/User.js';
import ChallengeCode from '../models/ChallengeCode.js';

//Some interfaces, such as using sr25519 however are only available via WASM
await cryptoWaitReady();

// load security certificates, in case something goes wrong, just fail loudly
const privateKey = fs.readFileSync(`${process.cwd()}/certs/cert.pem`).toString();
const publicKey = fs.readFileSync(`${process.cwd()}/certs/cert.pem.pub`).toString();

const generateToken = async (username) => {
  const payload = {
    iss: 'urn:litentry-auth-web3',
    sub: username,
    iat: DateTime.utc().toUnixInteger()
  };
  return new Promise((resolve, reject) => {
    jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '1h' }, (err, token) => {
      if (err) {
        global.log.error(err, 'Failed to sign jwt token.');
        reject(err);
      }
      resolve(token);
    });
  });
};

const validateSignature = (message, signature, username) => {
  // username aka address
  let isValid = false;
  try {
    const address = decodeAddress(username);
    const hexAddress = u8aToHex(address);
    isValid = signatureVerify(message, signature, hexAddress).isValid;
  } catch (err) {
    global.log.info(err, 'Failed to validate signature.');
  }
  return isValid;
};

const getActiveChallengeCode = async (address) => {
  let unused = await ChallengeCode.findUnused(address);
  if (unused) {
    const at = DateTime.fromJSDate(unused.createdAt);
    const now = DateTime.now().toUTC();
    const diff = Interval.fromDateTimes(at, now).length('seconds');
    const expiry = (3 * 60); // 3min in sec
    if (diff <= expiry) {
      return unused.challenge;
    }
    // delete older challenge codes
    await ChallengeCode.delete(unused.challengeCodeId);
    return null;
  }
};

const takeChallengeCode = async (address) => {
  let code = await getActiveChallengeCode(address);
  if (!code) {
    code = uuidv4().replaceAll('\-', '');
    await ChallengeCode.create(address, code);
  }
  return code;
};

const validateChallengeCode = async (address, code) => {
  const active = await getActiveChallengeCode(address);
  return (!!active ? active === code : false);
};

const signin = async (username, message, signature, challengeCode) => {
  const { error } = validations.user.validate({ username, message, signature, challengeCode });
  if (error) {
    throw new CustomError(error);
  }
  const challengeCodeValid = await validateChallengeCode(username, challengeCode);
  if (!challengeCodeValid) {
    throw new CustomError({ message: 'Your challenge code has expired.', status: 401 });
  }
  const sigValid = validateSignature(message, signature, username);
  if (!sigValid) {
    throw new CustomError({ message: 'Invalid username or signature.', status: 401 });
  }
  try {
    const token = await generateToken(username);
    await ChallengeCode.use(username, challengeCode);
    return token;
  } catch (err) {
    throw new ServerError('Unable to login.');
  }
};

passport.use(new passportBearer.Strategy(async (token, done) => {
  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    const { sub: username } = decoded;
    done(null, { username }, { scope: 'read' });
  } catch (err) {
    global.log.error(err, 'Failed to verify bearer token.');
    return done(new CustomError({ message: 'Invalid token.', status: 401 }));
  }
}));

export { passport, takeChallengeCode, signin };
