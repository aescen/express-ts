/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import shortid from 'shortid';
import supertest from 'supertest';
import { expect } from 'chai';

import server from '../../src/app';
import mongooseService from '../../src/common/services/mongoose.service';

const mongoose = mongooseService.getMongoose();

let firstUserIdTest: string;
const firstUserBody = {
  email: `test.${shortid.generate()}@gmail.com`,
  password: shortid.generate(),
};

let accessToken: string;
let refreshToken: string;

const newFirstName = 'Joseph';
const newFirstName2 = 'Paul';
const newLastName2 = 'Varro';

describe('users and auth endpoints', function () {
  this.timeout(10000);
  let request: supertest.SuperAgentTest;

  before(function () {
    request = supertest.agent(server);
  });

  it('should allow a POST to /users', async function () {
    const res = await request.post('/users').send(firstUserBody);

    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.id).to.be.a('string');
    firstUserIdTest = res.body.id;
  });

  it('should allow a POST to /auth', async function () {
    const res = await request.post('/auth').send(firstUserBody);
    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.accessToken).to.be.a('string');
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('should allow a GET from /users/:userId with an access token', async function () {
    const res = await request
      .get(`/users/${firstUserIdTest}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body._id).to.be.a('string');
    expect(res.body._id).to.equal(firstUserIdTest);
    expect(res.body.email).to.equal(firstUserBody.email);
  });

  describe('with a valid access token', function () {
    it('should disallow a GET to /users', async function () {
      const res = await request
        .get(`/users`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send();
      expect(res.status).to.equal(403);
    });

    it('should disallow a PATCH to /users/:userId', async function () {
      const res = await request
        .patch(`/users/${firstUserIdTest}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          email: firstUserBody.email,
          firstName: newFirstName,
        });
      expect(res.status).to.equal(403);
    });

    it('should disallow a PUT to /users/:userId with an nonexistent ID', async function () {
      const res = await request
        .put(`/users/i-do-not-exist`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          email: firstUserBody.email,
          password: firstUserBody.password,
          firstName: 'Marco',
          lastName: 'Shiva',
          permissionFlag: 8,
        });
      expect(res.status).to.equal(404);
    });

    it('should disallow a PUT to /users/:userId trying to change the permission flags', async function () {
      const res = await request
        .put(`/users/${firstUserIdTest}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          email: firstUserBody.email,
          password: firstUserBody.password,
          firstName: 'Marco',
          lastName: 'Shiva',
          permissionFlag: 8,
        });
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.have.length(1);
      expect(res.body.errors[0]).to.equal(
        'User cannot change permission flags',
      );
    });

    it('should allow a PUT to /users/:userId/permissionFlag/2 for testing', async function () {
      const res = await request
        .put(`/users/${firstUserIdTest}/permissionFlag/2`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({});
      expect(res.status).to.equal(204);
    });

    describe('with a new set of permission flags', function () {
      it('should allow a POST to /auth/refresh-token', async function () {
        const res = await request
          .post('/auth/refresh-token')
          .set({ Authorization: `Bearer ${accessToken}` })
          .send({ refreshToken });
        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body.accessToken).to.be.a('string');
        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
      });

      it('should allow a PUT to /users/:userId to change first and last names', async function () {
        const res = await request
          .put(`/users/${firstUserIdTest}`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send({
            email: firstUserBody.email,
            password: firstUserBody.password,
            firstName: newFirstName2,
            lastName: newLastName2,
            permissionFlag: 2,
          });
        expect(res.status).to.equal(204);
      });

      it('should allow a GET from /users/:userId and should have a new full name', async function () {
        const res = await request
          .get(`/users/${firstUserIdTest}`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send();
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.be.a('string');
        expect(res.body.firstName).to.equal(newFirstName2);
        expect(res.body.lastName).to.equal(newLastName2);
        expect(res.body.email).to.equal(firstUserBody.email);
        expect(res.body._id).to.equal(firstUserIdTest);
      });

      it('should allow a DELETE from /users/:userId', async function () {
        const res = await request
          .delete(`/users/${firstUserIdTest}`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send();
        expect(res.status).to.equal(204);
      });
    });
  });

  after(function (done) {
    // cleanup
    server.close(function () {
      mongoose.connection.db.dropDatabase(function () {
        mongoose.connection.close(done);
      });
    });
  });
});
