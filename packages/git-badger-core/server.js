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
  app.use(bodyParser.json());
  app.get('/badges/:badgeType/:project', async (req, res) => {
    const badgeType = req.params.badgeType;
    const project = req.params.project;
    const lastValue = await store.getLast(project, badgeType);
    console.log('lastV', lastValue);
    const badgeHandler = typesMap[badgeType];
    const badgeData = badgeHandler(lastValue.status);
    const badge = getLink(badgeData);
    console.log(badge);
    return res.send(badge);
  });

  app.post('/badges/:badgeType/:project', async (req, res) => {
    const status = req.body.status;
    const badgeType = req.params.badgeType;
    const project = req.params.project;
    if (typeof status === 'undefined') {
      return res.status(400).send('lol kek cheburek');
    }

    const badgeHandler = typesMap[req.params.badgeType];
    console.log(badgeHandler);
    await store.store(project, badgeType, status, Date.now());
    if (badgeHandler) {
      const meta = badgeHandler(status);
      const badge = getLink(meta);
      return res.send(badge);
    }
    return res.status(400).json(Object.keys(typesMap));
  });

  app.get('/', (req, res) => {
    const badgesSections = Object.values(typesMap).map(badgeCreator => {
      const examples = badgeCreator.examples.map(
        example => `<img src="${getLink(badgeCreator.create(example))}">`
      );
      return `
        <section>
          <h3>
            ${badgeCreator.name}
          </h3>
          <div>
            <span> ${badgeCreator.description} </span>
            ${examples.join('')}
          </div>
        </section>
      `;
    });

    const html = `
      <html>
        <head>
        </head>
        <body>
          ${badgesSections.join('')}
        </body>
      </html>
    `;
    res.send(html);
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

import eslintErrors from './templates/eslint-errors.js';

const templates = {
  'eslint-errors': eslintErrors
};

export { templates };
