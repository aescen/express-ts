/* eslint-disable */
import './env';

import util from 'util';
import winston from 'winston';
import * as expressWinston from 'express-winston';

import debug from 'debug';

export const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    // winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint(),
  ),
};
const debugNamespace: string = process.env.DEBUG!;
// @ts-ignore
const logger = winston.createLogger(loggerOptions);

debug.formatArgs = (args) => {};
debug.log = function (...args) {
  logger.log({
    level: 'info',
    // @ts-ignore
    namespace: this.namespace,
    message: util.format(...args),
    timestamp: new Date().toISOString(),
    // @ts-ignore
    diff: `+${debug.humanize(this.diff)}`,
  });
};
debug.enable(debugNamespace);

export default debug;
