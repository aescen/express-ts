import express from 'express';

import debug from '../../utils/debug.util';

import usersService from '../services/users.service';

const log: debug.IDebugger = debug('app:users-controller');

/**
 * UsersMiddleware
 * Middleware for users resource
 * @class UsersMiddleware
 */
class UsersMiddleware {
  constructor() {
    this.validatePatchEmail = this.validatePatchEmail.bind(this);
  }

  /**
   * validateEmailDoesNotExist
   * Validate email doesn't exist
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   * @returns
   * @memberof UsersMiddleware
   */
  async validateEmailDoesNotExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const user = await usersService.readByEmail(req.body.email);

    if (user) {
      return res.status(400).send({ error: `User email already exists` });
    }

    return next();
  }

  /**
   * validateEmailBelongsToUser
   * Validate email belongs to user
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   * @returns
   * @memberof UsersMiddleware
   */
  async validateEmailBelongsToUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const isValid = res.locals.user._id === req.body.id;

    if (!isValid) {
      return res.status(400).send({ error: `Invalid email` });
    }

    return next();
  }

  /**
   * validatePatchEmail
   * Validate email
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   * @returns
   * @memberof UsersMiddleware
   */
  async validatePatchEmail(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (!req.body.email) {
      return res.status(400).send({ error: `Invalid email` });
    }

    log('Validating email', req.body.email);
    return this.validateEmailBelongsToUser(req, res, next);
  }

  /**
   * validateUserExists
   * Validate user does exists
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   * @returns
   * @memberof UsersMiddleware
   */
  async validateUserExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const user = await usersService.readById(req.body.id);

    if (!user) {
      return res.status(404).send({
        error: `User ${req.body.id} not found`,
      });
    }

    res.locals.user = user;
    return next();
  }

  /**
   * extractParamUserId
   * Put params userId to body
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   * @memberof UsersMiddleware
   */
  async extractParamUserId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    req.body.id = req.params.userId;

    return next();
  }

  async userCannotChangePermission(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const isUnauthorized =
      'permissionFlag' in req.body &&
      req.body.permissionFlag !== res.locals.user.permissionFlag;

    if (isUnauthorized) {
      return res.status(400).send({
        errors: ['User cannot change permission flags'],
      });
    }

    return next();
  }
}

export default new UsersMiddleware();
