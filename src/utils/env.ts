import path from 'path';
import dotenv from 'dotenv';

const envFileName = `.env${process.env.NODE_ENV && `.${process.env.NODE_ENV}`}`;
const envRootPath = `${process.env.NODE_PATH && `${process.env.NODE_PATH}`}`;

let pathToEnvFile = path.resolve(envRootPath, envFileName);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dotenvResult: any;

const checkError = () => {
  if (dotenvResult.error) {
    throw dotenvResult.error;
  }
};

try {
  dotenvResult = dotenv.config({ path: pathToEnvFile });
  checkError();
} catch (error) {
  pathToEnvFile = path.resolve(process.cwd(), envFileName);
  dotenvResult = dotenv.config({ path: pathToEnvFile });
  checkError();
}
