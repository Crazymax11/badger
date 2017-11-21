const fs = require('fs');
const yaml = require('js-yaml');
const cmdArgs = require('command-line-args');
const cmdUsage = require('command-line-usage');
const server = require('@git-badger/server').default;

const defaultOptions = {
  badges: [
    'eslint-errors',
    'eslint-warnings',
    'flow-coverage',
    'test-coverage',
    'vue-component-decorator'
  ],
  store: {
    path: './db'
  },
  config: 'config.yml',
  port: 80,
  templates: './templates'
};

const optionsDefinition = [
  {
    name: 'badges',
    alias: 'b',
    type: String,
    multiple: true,
    description:
      'space separated list of badges. Will be required first as git-badger-%badgename%-badge.'
  },
  {
    name: 'store',
    alias: 's',
    type: String,
    description:
      'store name. Will be required first as git-badger-%storename%-store. All options must be provided in query format. Example: storename?password=1234&host=myhost'
  },
  {
    // path to config file. Any option found in CLI is high priorited than found in config
    name: 'config',
    alias: 'c',
    type: String,
    description: 'path to yaml config'
  },
  {
    name: 'port',
    alias: 'p',
    type: Number,
    description: 'port listen to'
  },
  {
    name: 'templates',
    alias: 't',
    type: String,
    description: 'path to directory with pug tempaltes'
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'show help'
  }
];
const cliOptions = cmdArgs(optionsDefinition);

if (cliOptions.help) {
  // eslint-disable-next-line
  return console.log(
    cmdUsage([
      {
        header: 'options',
        optionList: optionsDefinition
      }
    ])
  );
}

if (cliOptions.store) {
  if (cliOptions.store.includes('?')) {
    const storeName = cliOptions.store.split('?')[0];
    const storeOptions = cliOptions.store
      .split('?')[1]
      .reduce((acc, keyvalue) => {
        const [key, value] = keyvalue.split('=');
        acc[key] = value;
        return acc;
      });
    cliOptions.store = {
      ...storeOptions,
      name: storeName
    };
  }
}

const configOptions = readConfig(cliOptions.config || defaultOptions.config);

const targetOptions = Object.assign(
  {},
  defaultOptions,
  configOptions,
  cliOptions
);

server(
  targetOptions.port,
  createStore(targetOptions.store),
  readBadges(targetOptions.badges),
  [targetOptions.templates, __dirname + '/templates']
);

function readConfig(configpath = defaultOptions.config) {
  try {
    const content = fs.readFileSync(configpath, 'utf-8');
    return yaml.safeLoad(content);
  } catch (err) {
    return {};
  }
}

function readBadges(badges = defaultOptions.badges) {
  return badges.reduce((acc, badge) => {
    // trying to get badge creator by mask
    // eslint-disable-next-line
    acc[badge] = require(`git-badger-${badge}-badge`);

    // If badge exported as es6 module
    acc[badge] = acc[badge].default || acc[badge];
    return acc;
  }, {});
}

function createStore(storeConfig = defaultOptions.store) {
  let store = '';
  const { name: storeName, ...storeArgs } = storeConfig;
  // eslint-disable-next-line
  store = require(`git-badger-${storeName}-store`);

  // If store exported as es6 module
  store = store.default || store;

  // eslint-disable-next-line
  return new store(storeArgs);
}
