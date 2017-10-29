// @flow
import yaml from 'yaml';
import commandLineArgs from 'command-line-args';
import fs from 'fs';
import MysqlStore from 'git-badger-mysql-store';
import server from 'git-badger-core';

const optionDefinitions = [
  { name: 'port', alias: 'p', type: Number },

  { name: 'storeType', type: String },
  { name: 'mysqlhost', type: String },
  { name: 'mysqldb', type: String },
  { name: 'mysqluser', type: String },
  { name: 'mysqlpassword', type: String },
  { name: 'config', type: String, alias: 'c' }
];

const options = commandLineArgs(optionDefinitions);

const rawConfig = fs.readFileSync(options.config || `${__dirname}/config.yml`);
const config = yaml.eval(rawConfig);

config.port =
  options.port || config.port || Number(process.env.BADGE_PORT) || 8080;
config.storeType =
  options.storeType ||
  config.storeType ||
  process.env.BADGE_STORE_TYPE ||
  'file';

let store;
switch (config.storeType) {
  case 'mysql':
    store = new MysqlStore(
      config.mysql.port,
      config.mysql.user,
      config.mysql.password,
      config.mysql.database
    );
    break;
  default:
    console.error(`no store ${config.storeType}`);
    process.exit(1);
    // для успокоения флоу, он не может понять что process.exit(1) убьет все
    throw new Error('no store');
}

const port: number = config.port;

const badges = {
  'eslint-errors': require('./templates/eslint-errors.js'),
  'eslint-warnings': require('./templates/eslint-warnings.js'),
  'flow-coverage': require('./templates/flow-coverage.js'),
  'vue-component-decorator': require('./templates/vue-component-decorator.js')
};

server(port, store, badges);
