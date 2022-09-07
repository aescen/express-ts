import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';

/**
 * Routes for /users endpoint
 * @export
 * @class UsersRoute
 * @extends {CommonRoutesConfig}
 */
export class UsersRoute extends CommonRoutesConfig {
  /**
   * Creates an instance of UsersRoute.
   * @param {express.Application} app
   * @memberof UsersRoute
   */
  constructor(app: express.Application) {
    super(app, 'UsersRoute');
  }

  /**
   * Configure /users endpoint
   * TODO: add routes configurations
   * @returns
   * @memberof UsersRoute
   */
  configureRoutes() {
    // TODO: add configurations here
    this.app
      .route('/users')
      .get((req: express.Request, res: express.Response) => {
        res.status(200).send('List of users');
      })
      .post((req: express.Request, res: express.Response) => {
        res.status(200).send('Add user');
      });

    this.app
      .route('/users/:userId')
      .all(
        (
          req: express.Request,
          res: express.Response,
          next: express.NextFunction,
        ) => {
          // middleware for /users/:userId
          next();
        },
      )
      .get((req: express.Request, res: express.Response) => {
        res.status(200).send(`GET request for id: ${req.params.userId}`);
      })
      .put((req: express.Request, res: express.Response) => {
        res.status(200).send(`PUT request for id: ${req.params.userId}`);
      })
      .patch((req: express.Request, res: express.Response) => {
        res.status(200).send(`PATCH request for id: ${req.params.userId}`);
      })
      .delete((req: express.Request, res: express.Response) => {
        res.status(200).send(`DELETE request for id: ${req.params.userId}`);
      });

    return this.app;
  }
}
