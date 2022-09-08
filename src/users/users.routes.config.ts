import express from 'express';

import CommonRoutesConfig from '../common/common.routes.config';
import UsersController from './controllers/users.controller';
import UsersMiddleware from './middleware/users.middleware';

/**
 * Routes for /users endpoint
 * @export
 * @class UsersRoute
 * @extends {CommonRoutesConfig}
 */
export default class UsersRoute extends CommonRoutesConfig {
  /**
   * Creates an instance of UsersRoute.
   * @param {express.Application} app
   * @memberof UsersRoute
   */
  constructor(app: express.Application) {
    super(app, 'UsersRoute');
  }

  /**
   * configureRoutes
   * Configure /users endpoint
   * @returns
   * @memberof UsersRoute
   */
  configureRoutes() {
    this.app
      .route('/users')
      .get(UsersController.getList)
      .post(
        UsersMiddleware.validateUserBodyFields,
        UsersMiddleware.validateEmailDoesNotExist,
        UsersController.post,
      );

    this.app.param(`userId`, UsersMiddleware.extractParamUserId);
    this.app
      .route('/users/:userId')
      .all(UsersMiddleware.validateUserExists)
      .get(UsersController.getById)
      .delete(UsersController.deleteById);

    this.app.put(`/users/:userId`, [
      UsersMiddleware.validateUserBodyFields,
      UsersMiddleware.validateEmailBelongsToUser,
      UsersController.putById,
    ]);

    this.app.patch(`/users/:userId`, [
      UsersMiddleware.validatePatchEmail,
      UsersController.patchById,
    ]);

    return this.app;
  }
}
