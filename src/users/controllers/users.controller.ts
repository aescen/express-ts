/* eslint-disable class-methods-use-this */
import express from 'express';
import argon2 from 'argon2';
import debug from 'debug';

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
    req.body.password = await argon2.hash(req.body.password);
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
    const users = await usersService.list(0, 100);
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
    req.body.password = await argon2.hash(req.body.password);
    log(await usersService.partialUpdateById(req.body.id, req.body));
    res.status(204).send({ id: req.body.id });
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
      req.body.password = await argon2.hash(req.body.password);
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
