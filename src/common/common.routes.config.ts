import express from 'express';

export abstract class CommonRoutesConfig {
  app: express.Application; // routes app
  name: string; // routes name

  /**
   * Creates an instance of CommonRoutesConfig.
   * @param {express.Application} app
   * @param {string} name
   * @memberof CommonRoutesConfig
   */
  constructor(app: express.Application, name: string) {
    this.app = app; // set routes app
    this.name = name; // set routes name
    this.configureRoutes(); // routes configurations at initialization
  }

  /**
   * Get routes name
   * @returns routes name
   * @memberof CommonRoutesConfig
   */
  getName() {
    return this.name;
  }

  /**
   * Routes configurations method
   */
  abstract configureRoutes(): express.Application;
}
