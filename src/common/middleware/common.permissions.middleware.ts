/* eslint-disable no-bitwise */
import express from 'express';

import PermissionFlag from './common.permission.flag.enum';

/**
 * PermissionsMiddleware
 * Middleware for permissions
 * @class PermissionsMiddleware
 */
class PermissionsMiddleware {
  permissionFlagRequired(requiredPermissionFlag: PermissionFlag) {
    return (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const isAuthorized =
        res.locals.jwt.permissionFlag & requiredPermissionFlag;

      if (!isAuthorized) {
        return res.status(403).send();
      }

      return next();
    };
  }

  async onlySameUserOrAdminCanDoThisAction(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const isSameUser =
      req.body && req.body.id && req.body.id === res.locals.jwt.id;
    const isAdmin =
      res.locals.jwt.permissionFlag & PermissionFlag.ADMIN_PERMISSION;

    if (isAdmin || isSameUser) {
      return next();
    }

    return res.status(403).send();
  }
}

export default new PermissionsMiddleware();
