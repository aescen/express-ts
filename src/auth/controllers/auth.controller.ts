import '../../utils/env';

import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import debug from '../../utils/debug.util';

const log: debug.IDebugger = debug('app:auth-controller');

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const jwtSecret: string = process.env.JWT_SECRET!;
const tokenExpirationInSeconds: number = parseInt(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  process.env.TOKEN_EXPIRATION!,
  10,
);

/**
 * AuthController
 * Controller for /auth endpoint
 * @class AuthController
 */
class AuthController {
  /**
   * createJwt
   * Create jwt tokens
   * @param {express.Request} req
   * @param {express.Response} res
   * @returns
   * @memberof AuthController
   */
  async createJwt(req: express.Request, res: express.Response) {
    try {
      const refreshId = `${req.body.userId}${jwtSecret}`;
      const salt = crypto.createSecretKey(crypto.randomBytes(16));
      const hash = crypto
        .createHmac('sha512', salt)
        .update(refreshId)
        .digest('base64');

      req.body.refreshKey = salt.export();
      const token = jwt.sign(req.body, jwtSecret, {
        expiresIn: tokenExpirationInSeconds,
      });

      return res.status(201).send({ accessToken: token, refreshToken: hash });
    } catch (error) {
      log('createJwt error: %O', error);
      return res.status(500).send();
    }
  }
}

export default new AuthController();
