// @flow
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import getLink from 'shields-io-link';
import type { Store, BadgeCreator } from 'git-badger-types';

export default function createApp(
  port: number,
  store: Store,
  badges: $Exact<{ [string]: BadgeCreator }>,
  templates: string
) {
  const app = express();
  app.set('view engine', 'pug');
  app.set('views', templates);
  app.use(bodyParser.json());
  app.use(cors());
  app.use(express.static('dist'));
  app.get('/badges/:badge/image', async (req, res) => {
    const badge = req.params.badge;
    const badgeHandler = badges[badge];
    if (!badgeHandler) {
      return res.status(400).send('wrong badge!');
    }

    res.send(badgeHandler.image);
  });
  app.get('/badges/:badge', async (req, res) => {
    const badge = req.params.badge;
    const badgeHandler = badges[badge];
    if (!badgeHandler) {
      return res.status(400).send('wrong badge!');
    }

    res.render(
      'badgePage',
      {
        badge: badgeHandler
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

  app.get('/badges/:badgeType/:project', async (req, res) => {
    const badgeType = req.params.badgeType;
    const project = req.params.project;
    const lastValue = await store.getLast(project, badgeType);
    const badgeHandler = badges[badgeType];
    if (!badgeHandler) {
      return res.status(400).send('wrong badge!');
    }
    const badgeData = badgeHandler.create(lastValue.status);
    const badge = getLink(badgeData);
    return res.redirect(badge);
  });

  app.get('/badges/:badgeType/projects/:project', async (req, res) => {
    const badgeType = req.params.badgeType;
    const project = req.params.project;
    const lastValue = await store.getLast(project, badgeType);
    const badgeHandler = badges[badgeType];
    if (!badgeHandler) {
      return res.status(400).send('wrong badge!');
    }
    const badgeData = badgeHandler.create(lastValue.status);
    const badge = getLink(badgeData);
    return res.redirect(badge);
  });

  app.get('/badges/:badge/status/:status', async (req, res) => {
    const badgeType = req.params.badge;
    const status = req.params.status;
    const badgeHandler = badges[badgeType];
    if (!badgeHandler) {
      return res.status(400).send('wrong badge!');
    }
    const badgeData = badgeHandler.create(status);
    const badge = getLink(badgeData);
    return res.redirect(badge);
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

  app.get('/api/projects/:project/status', (req, res) => {
    const project = req.params.project;
    return store
      .getProjectStatus(project)
      .then(records => res.send(records))
      .catch(err => res.status(500).send(err));
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
  app.get('/api/badges', (req, res) => res.json(badges));

  app.get('/badges/:badgeType/history/:project', async (req, res) => {
    const project = req.params.project;
    const badgeType = req.params.badgeType;
    const records = await store.getLastN(1000, project, badgeType);
    const timedBadges = records.map(record => {
      const badge = badges[badgeType].create(record.status);
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

    const badgeHandler = badges[req.params.badgeType];
    await store.store(project, badgeType, status, Date.now());
    if (badgeHandler) {
      const meta = badgeHandler.create(status);
      const badge = getLink(meta);
      return res.send(badge);
    }
    return res.status(400).json(Object.keys(badges));
  });

  app.post('/badges/:badgeType/projects/:project', async (req, res) => {
    const status = req.body.status;
    const badgeType = req.params.badgeType;
    const project = req.params.project;
    if (typeof status === 'undefined') {
      return res.status(400).send('cant get status from body');
    }

    const badgeHandler = badges[req.params.badgeType];
    await store.store(project, badgeType, status, Date.now());
    if (badgeHandler) {
      const meta = badgeHandler.create(status);
      const badge = getLink(meta);
      return res.send(badge);
    }
    return res.status(400).json(Object.keys(badges));
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

  app.get('/activities', async (req, res) => {
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

  app.listen(port, err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('started');
  });

  return app;
}
