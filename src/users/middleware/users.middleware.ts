/* eslint-disable class-methods-use-this */
import express from 'express';
import debug from 'debug';

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
   * validateUserBodyFields
   * Validate user body fields
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   * @returns
   * @memberof UsersMiddleware
   */
  async validateUserBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (!req.body && !req.body.email && !req.body.password) {
      res.status(400).send({
        error: `Missing required fields email and password`,
      });
      return;
    }

    next();
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
      res.status(400).send({ error: `User email already exists` });
      return;
    }

    next();
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
    const user = await usersService.readByEmail(req.body.email);

    if (!user || user.id !== req.params.userId) {
      res.status(400).send({ error: `Invalid email` });
      return;
    }

    next();
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
      res.status(400).send({ error: `Invalid email` });
      return;
    }

    log('Validating email', req.body.email);
    this.validateEmailBelongsToUser(req, res, next);
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
    const user = usersService.readById(req.params.userId);

    if (!user) {
      res.status(404).send({
        error: `User ${req.params.userId} not found`,
      });
      return;
    }

    next();
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
    next();
  }
}

export default new UsersMiddleware();
