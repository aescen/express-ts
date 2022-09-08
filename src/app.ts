import express from 'express';
import * as http from 'http';
import cors from 'cors';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import debug from 'debug';

import CommonRoutesConfig from './common/common.routes.config';
import UsersRoute from './users/users.routes.config';

const port = 3000;
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

// configure winston to log all HTTP request
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true }),
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false; // when not debugging, log request as one liner
}

// initialize logger middleware
app.use(expressWinston.logger(loggerOptions));

// middleware to parse JSON body from HTTP request
app.use(express.json());

// middleware to allow cross origin
app.use(cors());

// initialize users route & add to main app routes
routes.push(new UsersRoute(app));

// root / top route
const runningMessage = `Server is running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

// listen server
server.listen(port, () => {
  routes.forEach((route) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });

  console.log(runningMessage);
});
