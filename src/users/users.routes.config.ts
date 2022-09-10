import express from 'express';
import { body } from 'express-validator';

import CommonRoutesConfig from '../common/common.routes.config';
import UsersController from './controllers/users.controller';
import UsersMiddleware from './middleware/users.middleware';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import JwtMiddleware from '../auth/middleware/jwt.middleware';
import PermissionsMiddleware from '../common/middleware/common.permissions.middleware';
import PermissionFlag from '../common/middleware/common.permission.flag.enum';
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
      .get(
        JwtMiddleware.validJwtNeeded,
        PermissionsMiddleware.permissionFlagRequired(
          PermissionFlag.ADMIN_PERMISSION,
        ),
        UsersController.getList,
      )
      .post(
        body('email').isEmail(),
        body('password')
          .isLength({ min: 5 })
          .withMessage('Must include password (5+ characters)'),
        body('firstName').isString().optional(),
        body('lastName').isString().optional(),
        body('permissionFlag').isInt().optional(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        UsersMiddleware.validateEmailDoesNotExist,
        UsersController.post,
      );

    this.app.param(`userId`, UsersMiddleware.extractParamUserId);
    this.app
      .route('/users/:userId')
      .all(
        UsersMiddleware.validateUserExists,
        JwtMiddleware.validJwtNeeded,
        PermissionsMiddleware.onlySameUserOrAdminCanDoThisAction,
      )
      .get(UsersController.getById)
      .delete(UsersController.deleteById);

    this.app.put(`/users/:userId`, [
      body('email').isEmail(),
      body('password')
        .isLength({ min: 5 })
        .withMessage('Must include password (5+ characters)'),
      body('firstName').isString(),
      body('lastName').isString(),
      body('permissionFlag').isInt(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      UsersMiddleware.validateEmailBelongsToUser,
      UsersMiddleware.userCannotChangePermission,
      PermissionsMiddleware.permissionFlagRequired(
        PermissionFlag.PAID_PERMISSION,
      ),
      UsersController.putById,
    ]);

    this.app.put(`/users/:userId/permissionFlag/:permissionFlag`, [
      JwtMiddleware.validJwtNeeded,
      PermissionsMiddleware.onlySameUserOrAdminCanDoThisAction,
      PermissionsMiddleware.permissionFlagRequired(
        PermissionFlag.FREE_PERMISSION,
      ),
      UsersController.updatePermissionFlag,
    ]);

    this.app.patch(`/users/:userId`, [
      body('email').isEmail(),
      body('password')
        .isLength({ min: 5 })
        .withMessage('Password must be 5+ characters')
        .optional(),
      body('firstName').isString().optional(),
      body('lastName').isString().optional(),
      body('permissionFlag').isInt().optional(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      UsersMiddleware.validatePatchEmail,
      UsersMiddleware.userCannotChangePermission,
      PermissionsMiddleware.permissionFlagRequired(
        PermissionFlag.PAID_PERMISSION,
      ),
      UsersController.patchById,
    ]);

    return this.app;
  }
}
