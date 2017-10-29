// @flow
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import getLink from './badger.js';
import { Store } from './store.types.js';

const types = {
  'eslint-errors': require('../templates/eslint-errors'),
  'eslint-warnings': require('../templates/eslint-warnings'),
  'flow-coverage': require('../templates/flow-coverage'),
  'vue-component': require('../templates/vue-component-decorator')
};

module.exports = function createApp(port: number, store: Store) {
  const app = express();
  app.use(bodyParser.json());
  app.get('/:badgeType/:project', async (req, res) => {
    const badgeType = req.params.badgeType;
    const project = req.params.project;

    const lastValue = await store.getLast(project, badgeType);
    const badgeHandler = types[badgeType];
    const badgeData = badgeHandler(lastValue);
    const badge = getLink(badgeData);
    return res.send(badge);
  });

  app.post('/:badgeType/:project', async (req, res) => {
    const status = req.body.status;
    const badgeType = req.params.badgeType;
    const project = req.params.project;
    if (typeof status === 'undefined') {
      return res.status(400).send('lol kek cheburek');
    }

    const badgeHandler = types[req.params.badgeType];
    await store.store(project, badgeType, status, Date.now());
    if (badgeHandler) {
      const meta = badgeHandler(status);
      const badge = getLink(meta);
      return res.send(badge);
    }
    return res.status(400).json(Object.keys(types));
  });

  app.get('/', (req, res) => res.json(Object.keys(types)));

  app.listen(port, err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('started');
  });

  return app;
};
