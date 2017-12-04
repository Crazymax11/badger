const chai = require('chai');

const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

function store(storeCreator, cleanup) {
  describe('#store', () => {
    beforeEach(function beforeHook() {
      this.context = createStoreForTest(storeCreator, String(Date.now()));
    });
    afterEach(function afterHook() {
      return cleanup(this.context.store);
    });
    it('should store status', async function test() {
      const { store, project, subject, status, time } = this.context;
      const result = await store.store(project, subject, status, time);
      expect(result).deep.equal({
        status,
        subject
      });
    });
    it('should throw error if no time provided', function test() {
      const { store, project, subject, status } = this.context;
      return expect(store.store(project, subject, status)).to.be.rejected;
    });
    it('should throw error if project is not a string', function test() {
      const { store, subject, status, time } = this.context;
      return expect(store.store(123, subject, status, time)).to.be.rejected;
    });
    it('should throw error if subject is not a string', function test() {
      const { store, project, status, time } = this.context;
      return expect(store.store(project, 123, status, time)).to.be.rejected;
    });
    it('should throw error if status is not a string', function test() {
      const { store, project, subject, time } = this.context;
      return expect(store.store(project, subject, 123, time)).to.be.rejected;
    });
    it('should throw error if time is not a number', function test() {
      const { store, project, subject, status, time } = this.context;
      return expect(store.store(project, subject, status, String(time))).to.be
        .rejected;
    });
  });
}

function getLast(storeCreator, cleanup) {
  describe('#getLast', () => {
    beforeEach(function beforeHook() {
      this.context = createStoreForTest(storeCreator, String(Date.now()));
    });
    afterEach(function afterHook() {
      return cleanup(this.context.store);
    });
    it('should return status and subject same as were provided to store', function test() {
      const { store, project, subject, status, time } = this.context;

      return store
        .store(project, subject, status, time)
        .then(() => store.getLast(project, subject))
        .then(res =>
          expect(res).to.deep.equal({
            subject,
            status
          })
        );
    });
    it('should return status and subject same as were provided in last store', function test() {
      const { store, project, subject, status, time } = this.context;

      return store
        .store(project, subject, status, time)
        .then(() => store.store(project, subject, `${status}-test`, time + 1))
        .then(() => store.getLast(project, subject))
        .then(res =>
          expect(res).to.deep.equal({
            subject,
            status: `${status}-test`
          })
        );
    });
    it('should return none status and subject if no records were provided in store before', function test() {
      const { store, project, subject } = this.context;
      return store.getLast(project, subject).then(res =>
        expect(res).to.deep.equal({
          subject,
          status: 'none'
        })
      );
    });
    it('should throw error if no subject provided', function test() {
      const { store, project, subject, status, time } = this.context;
      return expect(
        store.store(project, subject, status, time).then(() =>
          // $ExpectError
          store.getLast(project)
        )
      ).to.be.rejected;
    });
    it('should throw error if no project provided', function test() {
      const { store, project, subject, status, time } = this.context;
      return expect(
        store.store(project, subject, status, time).then(() =>
          // $ExpectError
          store.getLast(null, subject)
        )
      ).to.be.rejected;
    });
    it('should throw error if subject is not a string', function test() {
      const { store, project, subject, status, time } = this.context;

      return expect(
        store.store(project, subject, status, time).then(() =>
          // $ExpectError
          store.getLast(project, 123)
        )
      ).to.be.rejected;
    });
    it('should return status and subject same as were provided in last store for same project/subject', function test() {
      const { store, project, subject, status, time } = this.context;

      return store
        .store(project, subject, status, time)
        .then(() =>
          store.store(`${project}test`, `${subject}test`, status, time)
        )
        .then(() => store.getLast(project, subject))
        .then(res =>
          expect(res).to.deep.equal({
            subject,
            status
          })
        );
    });
  });
}

function getStatusSignature(storeCreator, cleanup) {
  describe('#getStatus(signature)', () => {
    beforeEach(function beforeHook() {
      this.context = createStoreForTest(storeCreator, String(Date.now()));
    });
    afterEach(function afterHook() {
      return cleanup(this.context.store);
    });
    it('should throw error if project is not a string', function test() {
      const { store, subject } = this.context;
      return expect(store.getStatus(123, subject)).to.be.rejected;
    });
    it('should throw error if subject is not a string', function test() {
      const { store, project } = this.context;
      return expect(store.getStatus(project, 123)).to.be.rejected;
    });
    it('should return status', function test() {
      const { store, project, subject, status, time } = this.context;
      return store
        .store(project, subject, status, time)
        .then(() => store.getStatus())
        .then(result => {
          expect(result).to.have.all.keys([
            'records',
            'projects',
            'subjects',
            'status'
          ]);
        });
    });
    it('should return status by project', function test() {
      const { store, project, subject, status, time } = this.context;
      return store
        .store(project, subject, status, time)
        .then(() => store.getStatus(project))
        .then(result => {
          expect(result).to.have.all.keys([
            'records',
            'projects',
            'subjects',
            'status'
          ]);
        });
    });
    it('should return status by subject', function test() {
      const { store, project, subject, status, time } = this.context;
      return store
        .store(project, subject, status, time)
        .then(() => store.getStatus(null, subject))
        .then(result => {
          expect(result).to.have.all.keys([
            'records',
            'projects',
            'subjects',
            'status'
          ]);
        });
    });
    it('should return status by project and status', function test() {
      const { store, project, subject, status, time } = this.context;
      return store
        .store(project, subject, status, time)
        .then(() => store.getStatus(project, subject))
        .then(result => {
          expect(result).to.have.all.keys([
            'records',
            'projects',
            'subjects',
            'status'
          ]);
        });
    });
    it('should return status even no records were stored', function test() {
      const { store } = this.context;
      return store.getStatus().then(result => {
        expect(result).to.have.all.keys([
          'records',
          'projects',
          'subjects',
          'status'
        ]);
      });
    });
  });
}

function getStatus(storeCreator, cleanup) {
  describe('#getStatus', () => {
    beforeEach(function beforeHook() {
      this.context = createStoreForTest(storeCreator, String(Date.now()));
    });
    afterEach(function afterHook() {
      return cleanup(this.context.store);
    });
    it('should return status when one record', function test() {
      const { store, project, subject, status, time } = this.context;
      return store
        .store(project, subject, status, time)
        .then(() => store.getStatus())
        .then(result => {
          expect(result).to.include({
            records: 1,
            projects: 1,
            subjects: 1,
            status: 'ok'
          });
        });
    });
    it('should return status', async function test() {
      const { store } = this.context;
      const records = await fillStore(1000, store);
      const projects = new Set();
      const subjects = new Set();
      records.forEach(record => {
        projects.add(record.project);
        subjects.add(record.subject);
      });
      const status = await store.getStatus();
      expect(status).to.include({
        records: 1000,
        projects: projects.size,
        subjects: subjects.size,
        status: 'ok'
      });
    });
    it('should return status by project', async function test() {
      const { store } = this.context;
      const records = await fillStore(1000, store);
      const projects = new Set();
      const subjects = new Set();
      let count = 0;
      records
        .filter(record => record.project === records[0].project)
        .forEach(record => {
          projects.add(record.project);
          subjects.add(record.subject);
          count++;
        });

      const status = await store.getStatus(records[0].project);
      expect(status).to.include({
        records: count,
        projects: projects.size,
        subjects: subjects.size,
        status: 'ok'
      });
    });
    it('should return status by subject', async function test() {
      const { store } = this.context;
      const records = await fillStore(1000, store);
      const projects = new Set();
      const subjects = new Set();
      let count = 0;
      records
        .filter(record => record.subject === records[0].subject)
        .forEach(record => {
          projects.add(record.project);
          subjects.add(record.subject);
          count++;
        });

      const status = await store.getStatus(undefined, records[0].subject);
      expect(status).to.include({
        records: count,
        projects: projects.size,
        subjects: subjects.size,
        status: 'ok'
      });
    });
    it('should return status by project and status', async function test() {
      const { store } = this.context;
      const records = await fillStore(1000, store);
      const projects = new Set();
      const subjects = new Set();
      let count = 0;
      records
        .filter(record => record.subject === records[0].subject)
        .filter(record => record.project === records[0].project)
        .forEach(record => {
          projects.add(record.project);
          subjects.add(record.subject);
          count++;
        });

      const status = await store.getStatus(
        records[0].project,
        records[0].subject
      );
      expect(status).to.include({
        records: count,
        projects: projects.size,
        subjects: subjects.size,
        status: 'ok'
      });
    });
    it('should return status even no records were stored', function test() {
      const { store } = this.context;
      return store.getStatus().then(result => {
        expect(result).to.include({
          records: 0,
          projects: 0,
          subjects: 0,
          status: 'ok'
        });
      });
    });
  });
}

function getLastN(storeCreator, cleanup) {
  describe('#getLastN', () => {
    beforeEach(function beforeHook() {
      this.context = createStoreForTest(storeCreator, String(Date.now()));
    });
    afterEach(function afterHook() {
      return cleanup(this.context.store);
    });
    it('should throw error if count is not a number', function test() {
      const { store, project, subject } = this.context;
      return expect(store.getLastN('123', project, subject)).to.be.rejected;
    });
    it('should throw error if project is not a string', function test() {
      const { store, subject } = this.context;
      return expect(store.getLastN(123, 123, subject)).to.be.rejected;
    });
    it('should throw error if subject is not a string', function test() {
      const { store, project } = this.context;
      return expect(store.getLastN(123, project, 123)).to.be.rejected;
    });
    it('should return array witn only none value if no values found by project and subject', async function test() {
      const { store, project, subject } = this.context;
      const records = await store.getLastN(123, project, subject);
      expect(records).have.length(1);
      expect(records[0]).to.deep.equal({
        status: 'none',
        time: 0,
        subject
      });
    });
    it('should return array of values in asc order', async function test() {
      const { store } = this.context;
      const records = await fillStore(1000, store);

      const stored = await store.getLastN(
        1000,
        records[0].project,
        records[0].subject
      );
      const recordsMustBeStored = records
        .filter(record => record.project === records[0].project)
        .filter(record => record.subject === records[0].subject)
        .map(record => ({
          time: record.time,
          status: record.status,
          subject: record.subject
        }));

      expect(recordsMustBeStored).to.be.deep.equal(stored);
    });
    it('should throw error if count is zero', function test() {
      const { store, project, subject } = this.context;
      return expect(store.getLastN(0, project, subject)).to.be.rejected;
    });
    it('should throw error if count is less than zero', function test() {
      const { store, project, subject } = this.context;
      return expect(store.getLastN(-1, project, subject)).to.be.rejected;
    });
    it('should throw error if count is not an integer', function test() {
      const { store, project, subject } = this.context;
      return expect(store.getLastN(1.1, project, subject)).to.be.rejected;
    });
  });
}

function getLastActivities(storeCreator, cleanup) {
  describe('#getLastActivities', () => {
    beforeEach(function beforeHook() {
      this.context = createStoreForTest(storeCreator, String(Date.now()));
    });
    afterEach(function afterHook() {
      return cleanup(this.context.store);
    });
    it('should throw error if limit is not provided', function test() {
      const { store } = this.context;
      return expect(store.getLastActivities(0)).to.be.rejected;
    });
    it('should throw error if limit is not an integer', function test() {
      const { store } = this.context;
      return expect(store.getLastActivities(0, '1')).to.be.rejected;
    });
    it('should throw error if offset is not an integer', function test() {
      const { store } = this.context;
      return expect(store.getLastActivities('123', 1)).to.be.rejected;
    });
    it('should throw error if limit is below 1', function test() {
      const { store } = this.context;
      return expect(store.getLastActivities(123, 0)).to.be.rejected;
    });
    it('should throw error if offset is below 0', function test() {
      const { store } = this.context;
      return expect(store.getLastActivities(-1, 123)).to.be.rejected;
    });
    it('should throw error if limit is higher than 100', function test() {
      const { store } = this.context;
      return expect(store.getLastActivities(123, 123)).to.be.rejected;
    });
    it('should return history records', async function test() {
      const { store } = this.context;
      const records = await fillStore(100, store);
      const result = await store.getLastActivities(0, 100);
      expect(result).to.deep.equal(records.reverse());
    });
    it('should return history records with offset', async function test() {
      const { store } = this.context;
      const records = await fillStore(100, store);
      const result = await store.getLastActivities(10, 10);
      expect(result).to.deep.equal(records.slice(80, 90).reverse());
    });
    it('should return array of one history record with limit 1', async function test() {
      const { store } = this.context;
      const records = await fillStore(100, store);
      const result = await store.getLastActivities(0, 1);

      expect(result[0]).to.deep.equal(records.pop());
    });
    it('should return empty array if offset is higher than count of records', async function test() {
      const { store } = this.context;
      await fillStore(1000, store);
      const result = await store.getLastActivities(10000, 1);
      expect(result).to.be.empty;
    });
  });
}

function basicSuite(storeCreator, cleanup) {
  describe('#basic suite', () => {
    store(storeCreator, cleanup);
    getLast(storeCreator, cleanup);
    getStatusSignature(storeCreator, cleanup);
    getStatus(storeCreator, cleanup);
    getLastN(storeCreator, cleanup);
    getLastActivities(storeCreator, cleanup);
  });
}

module.exports = {
  basicSuite,
  store,
  getLast,
  getStatusSignature,
  getStatus,
  getLastN
};

function createStoreForTest(storeCreator, testname) {
  const store = storeCreator();
  const project = `${testname}-project`;
  const subject = `${testname}-subject`;
  const status = `${testname}-status`;
  const time = Date.now();
  return {
    store,
    project,
    subject,
    status,
    time
  };
}

function createRandomRecord() {
  return {
    project: `test-${Math.ceil(Math.random() * 10)}`,
    subject: `test-${Math.ceil(Math.random() * 10)}`,
    status: `test-${Math.ceil(Math.random() * 10)}`,
    time: Date.now()
  };
}

async function fillStore(count, store) {
  const records = [];
  const time = Date.now() - count;
  for (let i = 0; i < count; i += 1) {
    const { project, subject, status } = createRandomRecord();
    records.push({
      project,
      subject,
      status,
      time: time + i
    });
    await store.store(project, subject, status, time + i);
  }
  return records;
}
