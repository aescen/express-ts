import express from 'express';
import { body } from 'express-validator';

import CommonRoutesConfig from '../common/common.routes.config';
import authController from './controllers/auth.controller';
import authMiddleware from './middleware/auth.middleware';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import jwtMiddleware from './middleware/jwt.middleware';

/**
 * AuthRoute
 * Routes for /auth endpoint
 * @export
 * @class AuthRoutes
 * @extends {CommonRoutesConfig}
 */
export default class AuthRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'AuthRoutes');
  }

  /**
   * configureRoutes
   * Configure /auth endpoint
   * @returns  {express.Application}
   * @memberof AuthRoutes
   */
  configureRoutes(): express.Application {
    this.app.post(`/auth`, [
      body('email').isEmail(),
      body('password').isString(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      authMiddleware.verifyUserPassword,
      authController.createJwt,
    ]);

    this.app.post(`/auth/refresh-token`, [
      jwtMiddleware.validJwtNeeded,
      jwtMiddleware.verifyRefreshBodyField,
      jwtMiddleware.validRefreshNeeded,
      authController.createJwt,
    ]);

    return this.app;
  }
}
