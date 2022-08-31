import fs from 'fs';
import { cryptoWaitReady, decodeAddress, signatureVerify } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import passport from 'passport';
import passportBearer from 'passport-http-bearer';
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';

import { validations } from '../models/User.js';
import { CustomError, ServerError } from './error.js';

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

const isValidSignature = (message, signature, username) => {
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

const signin = async (username, message, signature) => {
  const { error } = validations.user.validate({ username, message, signature });
  if (error) {
    throw new CustomError(error);
  }
  const isSigValid = isValidSignature(message, signature, username);
  if (!isSigValid) {
    throw new CustomError({ message: 'Invalid username or signature.', status: 401 });
  }
  try {
    return await generateToken(username);
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

export { passport, signin };
