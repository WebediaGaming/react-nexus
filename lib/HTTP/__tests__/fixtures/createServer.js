import Promise from 'bluebird';
import _ from 'lodash';
import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import should from 'should/as-function';

const HTTP_OK = 200;
const HTTP_NOT_FOUND = 404;

function createServer() {
  const server = express();
  server.use(bodyParser.json());
  const users = {
    id1: 'Alice',
    id2: 'Bob',
  };
  server.get('/users', (req, res) =>
    res.send(_(users)
      .keys()
      .map((userId) => [userId, `/users/${userId}`])
      .fromPairs()
    .value())
  );
  server.get('/users/:userId', (req, res) => {
    const { userId } = req.params;
    should(userId).be.a.String();
    if(!users.hasOwnProperty(userId)) {
      return res.status(HTTP_NOT_FOUND).end();
    }
    return res.send({ nickname: users[userId] });
  });
  server.post('/users/create', (req, res) => {
    const { userId, nickname } = req.body;
    should(userId).be.a.String();
    should(nickname).be.a.String();
    should(users).not.have.property(userId);
    users[userId] = nickname;
    return res.status(HTTP_OK).end();
  });
  server.post('/users/:userId/delete', (req, res) => {
    const { userId } = req.params;
    should(userId).be.a.String();
    if(!users.hasOwnProperty(userId)) {
      return res.status(HTTP_NOT_FOUND).end();
    }
    Reflect.deleteProperty(users, userId);
    return res.status(HTTP_OK).end();
  });
  server.post('/users/:userId/update', (req, res) => {
    const { userId } = req.params;
    should(userId).be.a.String();
    if(!users.hasOwnProperty(userId)) {
      return res.status(HTTP_NOT_FOUND).end();
    }
    const { nickname } = req.body;
    should(nickname).be.a.String();
    users[userId] = nickname;
    return res.status(HTTP_OK).end();
  });

  const httpServer = http.createServer(server);

  return Promise.promisifyAll(httpServer);
}

export default createServer;
