import './utils/env';

import express from 'express';
import * as http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import * as expressWinston from 'express-winston';

import debug, { loggerOptions } from './utils/debug.util';

import CommonRoutesConfig from './common/common.routes.config';
import UsersRoute from './users/users.routes.config';
import AuthRoutes from './auth/auth.routes.config';

const port = 3000;
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

if (!process.env.DEBUG) {
  loggerOptions.meta = false; // when not debugging, log request as one liner

  if (typeof global.it === 'function') {
    loggerOptions.level = 'http'; // for non-debug test runs, squelch entirely
  }
}

// initialize logger middleware
app.use(expressWinston.logger(loggerOptions));

// middleware to parse JSON body from HTTP request
app.use(express.json());

// middleware to allow cross origin
app.use(cors());

// help protect against common security vulnerabilities
app.use(helmet());

// Apply the rate limiting middleware to all requests
app.use(limiter);

// initialize routes & add to main app routes
routes.push(new UsersRoute(app));
routes.push(new AuthRoutes(app));

// root / top route
const runningMessage = `Server is running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404);
  return res.send({
    errors: ['Resource not found'],
  });
});

// listen server
server.listen(port, () => {
  routes.forEach((route) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });

  console.log(runningMessage);
});

export default server;
