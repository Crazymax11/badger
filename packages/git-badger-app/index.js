const fs = require('fs');
const yaml = require('js-yaml');
const cmdArgs = require('command-line-args');
const cmdUsage = require('command-line-usage');
const requireFallback = require('node-require-fallback');
const server = require('@git-badger/server').default;
const express = require('express');
const getLink = require('shields-io-link');

const defaultOptions = {
  badges: [
    'eslint-errors',
    'eslint-warnings',
    'flow-coverage',
    'test-coverage',
    'vue-component-decorator'
  ],
  store: {
    name: 'nedb',
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

const badges = readBadges(targetOptions.badges);
const store = createStore(targetOptions.store);
const app = server(targetOptions.port, store, badges);

app.set('view engine', 'pug');
app.set('views', [targetOptions.templates, `${__dirname}/templates`]);
app.use(express.static('dist'));
app.use(express.static('logo'));

app.get('/badges/:name', (req, res) => {
  const name = req.params.name;
  const badge = badges[name];
  if (!badge) {
    return res.redirect('/');
  }
  return res.render(
    'badgePage',
    {
      badge
    },
    (err, html) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      return res.send(html);
    }
  );
});

app.get('/projects/:project', async (req, res) => {
  const project = req.params.project;
  const links = await Promise.all(
    Object.entries(badges).map(async ([badgeType, badgeHandler]) => {
      const lastValue = await store.getLast(project, badgeType);
      // $ExpectError flow thinks that value is mixed type
      const badgeData = badgeHandler.create(lastValue.status);
      return getLink(badgeData);
    })
  );
  res.render(
    'projectBadges',
    {
      project,
      links
    },
    (err, html) => {
      if (err) {
        console.error(err);
        return res.send(err);
      }
      return res.send(html);
    }
  );
});

app.get('/projects', (req, res) => {
  res.render('workInProgress', {}, (err, html) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }
    return res.send(html);
  });
});

app.get('/badges', (req, res) =>
  res.render('badges', {}, (err, html) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }
    return res.send(html);
  })
);

app.get('/about', (req, res) => {
  res.render('about', {}, (err, html) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }
    return res.send(html);
  });
});

app.get('/', (req, res) => {
  res.render(
    'index',
    {
      badges,
      getLink
    },
    (err, html) => {
      if (err) {
        console.error(err);
        return res.send(err);
      }
      return res.send(html);
    }
  );
});

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
    const badgeCreator = requireFallback(
      `@git-badger/${badge}-badge`,
      `git-badger-${badge}-badge`,
      badge
    );
    if (badgeCreator) {
      // If badge exported as es6 module
      acc[badge] = badgeCreator.default || badgeCreator;
    } else {
      console.warn(`[WARN] Cant require badge ${badge}`);
    }

    return acc;
  }, {});
}

function createStore(storeConfig = defaultOptions.store) {
  let store = '';
  const { name: storeName, ...storeArgs } = storeConfig;
  store = requireFallback(
    `@git-badger/${storeName}-store`,
    `git-badger-${storeName}-store`,
    storeName
  );
  if (!store) {
    throw new Error(`Cant require store ${store}`);
  }
  // If store exported as es6 module
  store = store.default || store;

  // eslint-disable-next-line
  return new store(storeArgs);
}
