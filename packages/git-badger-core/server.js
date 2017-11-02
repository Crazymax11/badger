// @flow
import express from 'express';
import bodyParser from 'body-parser';

import getLink from './badger.js';
import type { Store, BadgeCreator } from './types.js';

export default function createApp(
  port: number,
  store: Store,
  typesMap: { [string]: BadgeCreator }
) {
  const app = express();
  app.set('view engine', 'pug');
  app.set('views', './templates');
  app.use(bodyParser.json());
  app.get('/badges/:badgeType/:project', async (req, res) => {
    const badgeType = req.params.badgeType;
    const project = req.params.project;
    const lastValue = await store.getLast(project, badgeType);
    const badgeHandler = typesMap[badgeType];
    const badgeData = badgeHandler.create(lastValue.status);
    const badge = getLink(badgeData);
    return res.redirect(badge);
  });

  app.post('/badges/:badgeType/:project', async (req, res) => {
    const status = req.body.status;
    const badgeType = req.params.badgeType;
    const project = req.params.project;
    if (typeof status === 'undefined') {
      return res.status(400).send('lol kek cheburek');
    }

    const badgeHandler = typesMap[req.params.badgeType];
    await store.store(project, badgeType, status, Date.now());
    if (badgeHandler) {
      const meta = badgeHandler(status);
      const badge = getLink(meta);
      return res.send(badge);
    }
    return res.status(400).json(Object.keys(typesMap));
  });

  app.get('/', (req, res) => {
    res.render(
      'index',
      {
        badges: typesMap,
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

  app.listen(port, err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('started');
  });

  return app;
}
