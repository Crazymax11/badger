const chai = require('chai');

const { expect } = chai;
const fetch = require('node-fetch');

const TEST_BADGE = 'eslint-errors';
const TEST_PROJECT_1 = 'test-project-1';
const server = require('./src/server.js');

import store from './src/store.js';

server(1337, store);
describe('HTTP interface /:badgeType/:project', () => {
  it('server should be available', () => getBadge(TEST_BADGE, TEST_PROJECT_1));
  it('POST should return 200', () =>
    createBadge(TEST_BADGE, TEST_PROJECT_1, 1).then(res =>
      expect(res.status).to.equal(200)
    ));
  it('POST should return badge', () =>
    createBadge(TEST_BADGE, TEST_PROJECT_1, 1)
      .then(res => res.text())
      .then(res => {
        const postRes = res;
        return getBadge(TEST_BADGE, TEST_PROJECT_1)
          .then(getRes => getRes.text())
          .then(getRes => expect(getRes).to.deep.equal(postRes));
      }));
  it('POST should return 4xx if badgeType wrong', () =>
    createBadge(`${TEST_BADGE}wrong`, TEST_PROJECT_1, 1).then(res =>
      expect(res.status).to.equal(400)
    ));
  it('POST should return list of all badges if badgeType wrong', () =>
    createBadge(`${TEST_BADGE}wrong`, TEST_PROJECT_1, 1)
      .then(res => res.text())
      .then(postRes =>
        getBadgesList()
          .then(res => res.text())
          .then(badgesList => expect(postRes).to.deep.equal(badgesList))
      ));
  it('POST should return 4xx if no value provided', () =>
    fetch(`http://localhost:1337/${TEST_BADGE}/${TEST_PROJECT_1}`, {
      method: 'POST',
      body: {
        value2: 1
      }
    }).then(res => expect(res.status).to.equal(400)));
  it('GET should return right badge', () => {
    const bestanswer = 'https://img.shields.io/badge/eslint--errors-1-red.svg';
    return createBadge(TEST_BADGE, TEST_PROJECT_1, 1)
      .then(() => getBadge(TEST_BADGE, TEST_PROJECT_1))
      .then(res => res.text())
      .then(res => expect(bestanswer).to.equal(res));
  });
  it('GET should return stub badge if no data for badge/project');
  it('GET / should return all badges', () =>
    getBadgesList()
      .then(res => res.json())
      .then(res =>
        expect(res).to.deep.equal([
          'eslint-errors',
          'eslint-warnings',
          'flow-coverage',
          'vue-component'
        ])
      ));
});

setTimeout(() => process.exit(1), 5000);
function createBadge(badge, project) {
  return fetch(`http://localhost:1337/${badge}/${project}`, {
    method: 'POST',
    body: JSON.stringify({
      status: 1
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

function getBadge(badge, project) {
  return fetch(`http://localhost:1337/${badge}/${project}`);
}

function getBadgesList() {
  return fetch('http://localhost:1337');
}
