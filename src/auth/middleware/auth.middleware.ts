import express from 'express';
import * as argon2 from 'argon2';

import usersService from '../../users/services/users.service';

/**
 * AuthMiddleware
 * Auth middleware
 * @class AuthMiddleware
 */
class AuthMiddleware {
  /**
   * verifyUserPassword
   * Verify user password
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   * @returns
   * @memberof AuthMiddleware
   */
  async verifyUserPassword(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const user = await usersService.readByEmailWithPassword(req.body.email);

    if (!user) {
      return res.status(404).send({ errors: ['User not found'] });
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [hashedPassword, salt] = user.password!.split('.$.');
    const password = `${btoa(req.body.password)}${salt}`;
    const matched = await argon2.verify(hashedPassword, password);

    if (!matched) {
      return res
        .status(400)
        .send({ errors: ['Invalid email and/or password'] });
    }

    req.body = {
      id: user._id,
      email: user.email,
      permissionFlag: user.permissionFlag,
    };

    return next();
  }
}

export default new AuthMiddleware();
