import crypto from 'crypto';
import fs from 'fs';
import passport from 'passport';
import passportBearer from 'passport-http-bearer';
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';

import User, { validations } from '../models/User.js';
import { CustomError, ServerError } from './error.js';

// load security certificates, in case something goes wrong, just fail loudly
const privateKey = fs.readFileSync(`${process.cwd()}/certs/cert.pem`).toString();
const publicKey = fs.readFileSync(`${process.cwd()}/certs/cert.pem.pub`).toString();


const hashPassword = (password, salt) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hash) => {
      if (err) { reject(err); }
      resolve(hash.toString('hex'));
    });
  });
};

const validatePassword = async (user, password) => {
  try {
    const inputPasswordHash = await hashPassword(password, user.salt);
    const inputPasswordHashBuff = Buffer.from(inputPasswordHash, 'hex');
    const userPasswordHashBuff = Buffer.from(user.passwordHash, 'hex');
    return crypto.timingSafeEqual(inputPasswordHashBuff, userPasswordHashBuff);
  } catch (err) {
    global.log.error(err, 'Failed to validate password.');
  }
  return false;
};

const generateToken = async (user) => {
  const payload = {
    iss: 'urn:litentry-auth',
    sub: user.username,
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

const signin = async (username, password) => {
  const user = await User.findByUsername(username);
  if (!user) {
    throw new CustomError({ message: 'User not found.', status: 404 });
  }
  const isPasswordValid = await validatePassword(user, password);
  if (!isPasswordValid) {
    try {
      await User.countLoginFailed(user.username);
    } catch (err) {
      global.log.error(err, 'Failed to update login-failed count.');
    }
    throw new CustomError({ message: 'Incorrect username or password.', status: 401 });
  }
  try {
    const token = await generateToken(user);
    return token;
  } catch (err) {
    throw new ServerError('Unable to login.');
  }
};

const signup = async (username, password) => {
  const { error } = validations.newUser.validate({ username, password }, { abortEarly: false });
  if (error) {
    throw new CustomError(error);
  }
  try {
    const salt = crypto.randomBytes(32).toString('hex');
    const passwordHash = await hashPassword(password, salt);
    await User.createUser({ username, passwordHash, salt });
  } catch (err) {
    global.log.error(err, 'Failed to sing-up user account.');
    throw new CustomError('Unable to login.');
  }
};

passport.use(new passportBearer.Strategy(async (token, done) => {
  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    const { sub } = decoded;
    const user = await User.findByUsername(sub);
    if (!user) {
      global.log.error(err, 'Token was verified, but the user not found.');
      done(null, false);
    }
    // TODO: remove extra details from user - pass and hash etc
    done(null, user, { scope: 'read' });
  } catch (err) {
    global.log.error(err, 'Failed to verify bearer token.');
    return done(new CustomError({ message: 'Invalid token.', status: 401 }));
  }
}));

export { passport, signin, signup };
