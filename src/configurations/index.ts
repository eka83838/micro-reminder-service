import * as nconf from 'nconf';
import * as path from 'path';
import 'dotenv/config';

//Read Configurations
const configs = new nconf.Provider({
  env: true,
  argv: true,
  store: {
    type: 'file',
    file: path.join(__dirname, `./config.${process.env.NODE_ENV || 'dev'}.json`)
  }
});

export interface IServerConfigurations {
    port: number;
    host: string;
    plugins: Array<string>;
}

export interface IDataConfiguration {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: string;
}

export function getDatabaseConfig(): IDataConfiguration {
  return configs.get('database');
}

export function getServerConfigs(): IServerConfigurations {
  return configs.get('server');
}
