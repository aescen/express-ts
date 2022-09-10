import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import Jwt from '../../common/types/jwt';
import usersService from '../../users/services/users.service';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const jwtSecret: string = process.env.JWT_SECRET!;

/**
 * JwtMiddleware
 * Middleware for jwt
 * @class JwtMiddleware
 */
class JwtMiddleware {
  /**
   * verifyRefreshBodyField
   * Verify refresh key filed in body
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   * @returns
   * @memberof JwtMiddleware
   */
  verifyRefreshBodyField(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const isField = req.body && req.body.refreshToken;
    if (!isField) {
      return res
        .status(400)
        .send({ errors: ['Missing required field: refreshToken'] });
    }

    return next();
  }

  /**
   * validRefreshNeeded
   * Validate refresh key
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   * @returns
   * @memberof JwtMiddleware
   */
  async validRefreshNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: any = await usersService.readByEmailWithPassword(
      res.locals.jwt.email,
    );

    const refreshId = `${res.locals.jwt.userId}${jwtSecret}`;
    const salt = crypto.createSecretKey(
      Buffer.from(res.locals.jwt.refreshKey.data),
    );

    const hash = crypto
      .createHmac('sha512', salt)
      .update(refreshId)
      .digest('base64');

    if (hash === req.body.refreshToken) {
      req.body = {
        id: user._id,
        email: user.email,
        permissionFlag: user.permissionFlag,
      };
      return next();
    }

    return res.status(400).send({ errors: ['Invalid refresh token'] });
  }

  /**
   * validJwtNeeded
   * Validate jwt authorization
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   * @returns
   * @memberof JwtMiddleware
   */
  validJwtNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (!req.headers.authorization) {
      return res.status(401).send();
    }

    const authorization = req.headers.authorization.split(' ');

    if (authorization[0] !== 'Bearer') {
      return res.status(401).send();
    }

    try {
      res.locals.jwt = jwt.verify(authorization[1], jwtSecret) as Jwt;
    } catch (err) {
      return res.status(403).send();
    }

    return next();
  }
}

export default new JwtMiddleware();
