import { expect } from 'chai';
import fetch from 'node-fetch';

import store from './store.js';
import server from './server.js';

import eslintErrors from './templates/eslint-errors';
import eslintWarnings from './templates/eslint-warnings';
import flowCoverage from './templates/flow-coverage';
import vueComponentDecorator from './templates/vue-component-decorator';

const TEST_BADGE = 'eslint-errors';
const TEST_PROJECT_1 = 'test-project-1';

const badges = {
  'eslint-errors': eslintErrors,
  'eslint-warnings': eslintWarnings,
  'flow-coverage': flowCoverage,
  'vue-component-decorator': vueComponentDecorator
};
server(1337, store, badges);
describe('HTTP interface /badges/:badgeType/:project', () => {
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
          'vue-component-decorator'
        ])
      ));
});

describe('#status', () => {
  describe('/status', () => {
    it('should return system status');
    it('should return store status in system status');
    it('should return application status in system status');
    it('should return error status when store is in fire');
    it('should return json if json asked');
    it('should return html in browser');
  });
  describe('/status/:badge', () => {
    it('should return 404 then badge not found');
    it('should return store status for badge');
    it('should return error status of store when store is in fire');
    it('should return examples of badge from templater');
    it('should return json if json asked');
    it('should return html in browser');
  });
  describe('/status/:badge/:project', () => {
    it('should return 404 then badge not found');
    it('should return 404 then project not found');
    it('should return store status for badge and project');
    it('should return error status of store when store is in fire');
    it('should return examples of badge from templater');
    it('should return json if json asked');
    it('should return html in browser');
  });
  describe('/status/projects/:project', () => {
    it('should return 404 then project not found');
    it('should return store status for project');
    it('should return error status of store when store is in fire');
    it('should return current badges for project');
    it('should return json if json asked');
    it('should return html in browser');
  });
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
  return fetch(`http://localhost:1337/badges/${badge}/${project}`);
}

function getBadgesList() {
  return fetch('http://localhost:1337');
}
