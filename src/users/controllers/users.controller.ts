import express from 'express';
import argon2 from 'argon2';
import crypto from 'crypto';

import debug from '../../utils/debug.util';

import PatchUserDto from '../dto/patch.user.dto';
import usersService from '../services/users.service';

const log: debug.IDebugger = debug('app:users-controller');

/**
 * UsersController
 * Controller for users resource
 * @class UsersController
 */
class UsersController {
  /**
   * post
   * Add new user
   * @param {express.Request} req
   * @param {express.Response} res
   * @memberof UsersController
   */
  async post(req: express.Request, res: express.Response) {
    const salt = crypto
      .createSecretKey(crypto.randomBytes(16))
      .export()
      .toString('hex');
    const hashInput = `${btoa(req.body.password)}${salt}`;

    req.body.password = await argon2.hash(hashInput);
    req.body.password = `${req.body.password}.$.${salt}`;

    const userId = await usersService.create(req.body);
    res.status(201).send({ id: userId });
  }

  /**
   * getList
   * Get list of user
   * @param {express.Request} req
   * @param {express.Response} res
   * @memberof UsersController
   */
  async getList(req: express.Request, res: express.Response) {
    const { limit = 100, page = 0 } = req.query;
    const users = await usersService.list(limit as number, page as number);
    res.status(200).send(users);
  }

  /**
   * getById
   * Get user by id
   * @param {express.Request} req
   * @param {express.Response} res
   * @memberof UsersController
   */
  async getById(req: express.Request, res: express.Response) {
    const user = await usersService.readById(req.body.id);
    res.status(200).send(user);
  }

  /**
   * getByEmail
   * Get user by email
   * @param {express.Request} req
   * @param {express.Response} res
   * @memberof UsersController
   */
  async getByEmail(req: express.Request, res: express.Response) {
    const user = await usersService.readByEmail(req.params.email);
    res.status(200).send(user);
  }

  /**
   * putById
   * Update user by id
   * @param {express.Request} req
   * @param {express.Response} res
   * @memberof UsersController
   */
  async putById(req: express.Request, res: express.Response) {
    const salt = crypto
      .createSecretKey(crypto.randomBytes(16))
      .export()
      .toString('hex');
    const hashInput = `${btoa(req.body.password)}${salt}`;

    req.body.password = await argon2.hash(hashInput);
    req.body.password = `${req.body.password}.$.${salt}`;

    log(await usersService.partialUpdateById(req.body.id, req.body));
    res.status(204).send({ id: req.body.id });
  }

  /**
   * updatePermissionFlag
   * Update permission flag
   * @param {express.Request} req
   * @param {express.Response} res
   * @memberof UsersController
   */
  async updatePermissionFlag(req: express.Request, res: express.Response) {
    const patchUserDto: PatchUserDto = {
      permissionFlag: parseInt(req.params.permissionFlag, 10),
    };
    log(await usersService.partialUpdateById(req.body.id, patchUserDto));
    res.status(204).send();
  }

  /**
   * patchById
   * Partially update user by id
   * @param {express.Request} req
   * @param {express.Response} res
   * @memberof UsersController
   */
  async patchById(req: express.Request, res: express.Response) {
    if (req.body.password) {
      const salt = crypto
        .createSecretKey(crypto.randomBytes(16))
        .export()
        .toString('hex');
      const hashInput = `${btoa(req.body.password)}${salt}`;

      req.body.password = await argon2.hash(hashInput);
      req.body.password = `${req.body.password}.$.${salt}`;
    }

    log(await usersService.partialUpdateById(req.body.id, req.body));
    res.status(204).send();
  }

  /**
   * deleteById
   * Delete user by id
   * @param {express.Request} req
   * @param {express.Response} res
   * @memberof UsersController
   */
  async deleteById(req: express.Request, res: express.Response) {
    log(await usersService.deleteById(req.body.id));
    res.status(204).send();
  }
}

export default new UsersController();
