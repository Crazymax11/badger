// @flow
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

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
  app.use(cors());
  app.get('/badges/:badgeType/:project', async (req, res) => {
    const badgeType = req.params.badgeType;
    const project = req.params.project;
    const lastValue = await store.getLast(project, badgeType);
    const badgeHandler = typesMap[badgeType];
    const badgeData = badgeHandler.create(lastValue.status);
    const badge = getLink(badgeData);
    return res.redirect(badge);
  });

  app.get('/badges/:project', async (req, res) => {
    const project = req.params.project;
    const links = await Promise.all(
      Object.entries(typesMap).map(async ([badgeType, badgeHandler]) => {
        const lastValue = await store.getLast(project, badgeType);
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

  app.get('/badges/:badgeType/history/:project', async (req, res) => {
    const project = req.params.project;
    const badgeType = req.params.badgeType;
    const records = await store.getLastN(1000, project, badgeType);
    const timedBadges = records.map(record => {
      const badge = typesMap[badgeType].create(record.status);
      return {
        link: getLink(badge),
        time: record.time
      };
    });
    res.render(
      'projectBadgeHistory',
      {
        project,
        timedBadges
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

  app.post('/badges/:badgeType/:project', async (req, res) => {
    const status = req.body.status;
    const badgeType = req.params.badgeType;
    const project = req.params.project;
    if (typeof status === 'undefined') {
      return res.status(400).send('cant get status from body');
    }

    const badgeHandler = typesMap[req.params.badgeType];
    await store.store(project, badgeType, status, Date.now());
    if (badgeHandler) {
      const meta = badgeHandler.create(status);
      const badge = getLink(meta);
      return res.send(badge);
    }
    return res.status(400).json(Object.keys(typesMap));
  });

  app.get('/status', async (req, res) => {
    try {
      const status = await store.getStatus();
      res.json(status);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get('/status/:badgeType', async (req, res) => {
    try {
      const status = await store.getStatus(undefined, req.params.badgeType);
      res.json(status);
    } catch (err) {
      res.status(500).send(err);
    }
  });
  app.get('/status/projects/:project', async (req, res) => {
    try {
      const status = await store.getStatus(req.params.project, undefined);
      res.json(status);
    } catch (err) {
      res.status(500).send(err);
    }
  });
  app.get('/status/:badgeType/:project', async (req, res) => {
    try {
      const status = await store.getStatus(
        req.params.project,
        req.params.badgeType
      );
      res.json(status);
    } catch (err) {
      res.status(500).send(err);
    }
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
