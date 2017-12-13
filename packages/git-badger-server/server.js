// @flow
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import getLink from 'shields-io-link';
import type { Store, BadgeCreator } from 'git-badger-types';

export default function createApp(
  port: number,
  store: Store,
  badges: $Exact<{ [string]: BadgeCreator }>
) {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  app.get('/api/badges/:name/image', async (req, res) => {
    const name = req.params.name;
    const badge = badges[name];
    if (!badge) {
      return res.status(404);
    }

    return res.send(badge.image);
  });

  app.get('/api/badges/:name', async (req, res) => {
    const name = req.params.name;
    const badge = badges[name];
    if (!badge) {
      return res.sendStatus(404);
    }
    return res.json(badge);
  });

  app.get('/api/badges/:name/projects/:project', async (req, res) => {
    const name = req.params.name;
    const project = req.params.project;
    const lastValue = await store.getLast(project, name);
    const badge = badges[name];
    if (!badge) {
      return res.sendStatus(404);
    }
    const shieldData = badge.create(lastValue.status);
    const shieldLink = getLink(shieldData);
    return res.redirect(shieldLink);
  });

  app.get('/api/badges/:name/status/:status', async (req, res) => {
    const name = req.params.name;
    const status = req.params.status;
    const badge = badges[name];
    if (!badge) {
      return res.sendStatus(404);
    }
    const shieldData = badge.create(status);
    const shieldLink = getLink(shieldData);
    return res.redirect(shieldLink);
  });

  app.get('/api/projects/:project/status', (req, res) => {
    const project = req.params.project;
    return store
      .getProjectStatus(project)
      .then(records => res.send(records))
      .catch(err => res.status(500).send(err));
  });

  app.get('/api/badges', (req, res) => res.json(badges));

  app.post('/api/badges/:name/projects/:project', async (req, res) => {
    const status = req.body.status;
    const name = req.params.name;
    const project = req.params.project;
    const badge = badges[name];
    if (!badge) {
      return res.sendStatus(404);
    }

    if (typeof status === 'undefined') {
      return res.status(400).send('cant get status from body');
    }

    await store.store(project, name, status, Date.now());

    const shieldData = badge.create(status);
    const shieldLink = getLink(shieldData);
    return res.send(shieldLink);
  });

  app.get('/api/activities', async (req, res) => {
    let limit = req.query.limit || '10';
    let offset = req.query.offset || '0';

    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);

    if (Number.isNaN(limit)) {
      return res.status(500).send('Limit must be an integer!');
    }

    if (Number.isNaN(offset)) {
      return res.status(500).send('Offset must be an integer!');
    }

    if (limit <= 0) {
      limit = 1;
    } else if (limit > 100) {
      limit = 100;
    }

    if (offset < 0) {
      offset = 1;
    }

    try {
      const activities = await store.getLastActivities(offset, limit);
      return res.json(activities);
    } catch (err) {
      return res.status(500).send(err);
    }
  });

  app.get('/api/status', async (req, res) => {
    try {
      const status = await store.getStatus();
      res.json(status);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get('/api/status/:badgeName', async (req, res) => {
    try {
      const status = await store.getStatus(undefined, req.params.badgeName);
      res.json(status);
    } catch (err) {
      res.status(500).send(err);
    }
  });
  app.get('/api/status/projects/:project', async (req, res) => {
    try {
      const status = await store.getStatus(req.params.project, undefined);
      res.json(status);
    } catch (err) {
      res.status(500).send(err);
    }
  });
  app.get('/api/status/:badgeName/:project', async (req, res) => {
    try {
      const status = await store.getStatus(
        req.params.project,
        req.params.badgeName
      );
      res.json(status);
    } catch (err) {
      res.status(500).send(err);
    }
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
