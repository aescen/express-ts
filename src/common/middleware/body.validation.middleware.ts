import express from 'express';
import { validationResult } from 'express-validator';

/**
 * BodyValidationMiddleware
 * Body validation middleware
 * @class BodyValidationMiddleware
 */
class BodyValidationMiddleware {
  /**
   * verifyBodyFieldsErrors
   * Verify for errors in body fields (use after express-validator/body)
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   * @returns
   * @memberof BodyValidationMiddleware
   */
  verifyBodyFieldsErrors(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    return next();
  }
}

export default new BodyValidationMiddleware();
