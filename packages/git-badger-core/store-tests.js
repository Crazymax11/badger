// @flow

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import type { Store } from './types.js';

type StoreCreator = () => Store;
type Cleanup = Store => Promise;

chai.use(chaiAsPromised);

export default function testStore(
  storeCreator: StoreCreator,
  cleanup: Cleanup
): void {
  describe('#store basic suite', () => {
    beforeEach(function beforeHook() {
      this.context = createStoreForTest(storeCreator, String(Date.now()));
    });
    afterEach(function afterHook() {
      return cleanup(this.context.store);
    });
    describe('#store', () => {
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
        // $ExpectError
        return expect(store.store(project, subject, status)).to.be.rejected;
      });
      it('should throw error if project is not a string', function test() {
        const { store, subject, status, time } = this.context;
        // $ExpectError
        return expect(store.store(123, subject, status, time)).to.be.rejected;
      });
      it('should throw error if subject is not a string', function test() {
        const { store, project, status, time } = this.context;
        // $ExpectError
        return expect(store.store(project, 123, status, time)).to.be.rejected;
      });
      it('should throw error if status is not a string', function test() {
        const { store, project, subject, time } = this.context;
        // $ExpectError
        return expect(store.store(project, subject, 123, time)).to.be.rejected;
      });
      it('should throw error if time is not a number', function test() {
        const { store, project, subject, status, time } = this.context;
        // $ExpectError
        return expect(store.store(project, subject, status, String(time))).to.be
          .rejected;
      });
    });
    describe('#getLast', () => {
      it('should return status and subject like provided in store', function test() {
        const { store, project, subject, status, time } = this.context;

        return store.store(project, subject, status, time).then(() =>
          store.getLast(project, subject).then(res =>
            expect(res).to.deep.equal({
              subject,
              status
            })
          )
        );
      });
      it('should return status and subject like provided in last store', function test() {
        const { store, project, subject, status, time } = this.context;

        return store
          .store(project, subject, status, time)
          .then(() => store.store(project, subject, `${status}-test`, time + 1))
          .then(() =>
            store.getLast(project, subject).then(res =>
              expect(res).to.deep.equal({
                subject,
                status: `${status}-test`
              })
            )
          );
      });
      it('should return none status and subject if no records were provided in store', function test() {
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
      it('should return status and subject like provided in last store for same project/subject', function test() {
        const { store, project, subject, status, time } = this.context;

        return store
          .store(project, subject, status, time)
          .then(() =>
            store.store(`${project}test`, `${subject}test`, status, time)
          )
          .then(() =>
            store.getLast(project, subject).then(res =>
              expect(res).to.deep.equal({
                subject,
                status
              })
            )
          );
      });
    });
  });
}

function createStoreForTest(storeCreator: StoreCreator, testname: string) {
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
