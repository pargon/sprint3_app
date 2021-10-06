/* global describe it before */
const sinon = require('sinon');
const request = require('supertest');
const database = require('../src/model');
const users = require('../src/controllers/midds/users');
const token = require('../src/controllers/midds/token');
const { makeServer } = require('../src/server');

process.env.CRYPTO_KEY = 'HOLA';

describe('Api test users', () => {
  before(() => {
    const vFindOne = sinon.stub();
    vFindOne.onCall(0).returns(null);
    vFindOne.onCall(1).returns(null);

    const ModeloFalso = {
      findAll() {
        return Promise.resolve([
          {
            id: 1,
          },
        ]);
      },
      findOne: vFindOne,
      create: sinon.mock().atLeast(1).returns({
        id: 1,
        userid: 'userfalso1',
        nombre: 'nombrefalso1',
      }),
    };
    // saltamos getModel
    sinon.stub(database, 'getModel').returns(ModeloFalso);
    // saltamos validación de token
    sinon.stub(token, 'chkToken').callsFake((req, res, next) => { next(); });
    // saltamos validación de admin
    sinon.stub(users, 'chkAdmin').callsFake((req, res, next) => { next(); });
  });

  it('return new user', (done) => {
    const server = makeServer();
    request(server)
      .post('/api/v1/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(
        {
          id: 1,
          userid: 'userfalso1',
          nombre: 'nombrefalso1',
        },
        done,
      );
  });
});
