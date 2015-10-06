import _ from 'lodash';
import express from 'express';
import jwt from 'jsonwebtoken';

import secret from './secret';

export const users = [
  {
    userId: 'CategoricalDude',
    userName: 'Immanuel Kant',
    profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Immanuel_Kant_%28painted_portrait%29.jpg',
    follows: [],
  },
  {
    userId: '!@#',
    userName: 'Frierich Nietzsche',
    profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Nietzsche187a.jpg',
    follows: [],
  },
  {
    userId: 'b@d_s@nt@',
    userName: 'Plato',
    profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Plato_Silanion_Musei_Capitolini_MC1377.jpg',
    follows: [],
  },
];

export const authTokens = [
  {
    authToken: 'E47Exd7RdDds',
    userId: '!@#',
  },
];

function getAuthToken(req) {
  return _.find(authTokens, ({ authToken }) => authToken === req.query.authToken);
}

function getUserFromToken(authToken) {
  return _.find(users, ({ userId }) => userId === authToken.userId);
}

function requireValidToken(req, res, next) {
  const authToken = getAuthToken(req);
  if(!authToken) {
    return res.status(401).send({ err: 'Requires valid authToken' });
  }
  const user = getUserFromToken(authToken);
  if(!user) {
    return res.status(500).send({ err: 'No user found with given token' });
  }
  req.user = user;
  next();
}

function debug(req, res, next) {
  const token = req.get('X-Debug-Token');
  if(!token) {
    return next();
  }
  return jwt.verify(token, secret, (err) => {
    if(err) {
      return res.status(401).send({ err: 'Invalid X-Debug-Token' });
    }
    const originalSend = res.send;
    res.send = function debugSend(obj) {
      if(!_.isObject(obj)) {
        return originalSend.call(this, obj);
      }
      return originalSend.call(this, Object.assign({}, obj, {
        _debug: { xDebugToken: token },
      }));
    };
    next();
  });
}

function notFound(req, res) {
  res.status(404).send({ err: 'Unknown route' });
}

export default express()
  .use(debug)
  .get('/users', (req, res) =>
    res.send({ items: users })
  )
  .get('/users/:userId', (req, res) => {
    const user = _.find(users, ({ userId }) => userId === req.params.userId);
    if(!users) {
      return res.status(404).send({ err: 'No such user' });
    }
    return res.send(user);
  })
  .get('/me', requireValidToken, (req, res) => {
    return res.send(req.user);
  })
  .post('/users/:userId/follow', requireValidToken, (req, res) => {
    const userToFollow = _.find(users, ({ userId }) => userId === req.params.userId);
    if(!userToFollow) {
      return res.status(404).send({ err: 'No such user' });
    }
    const { follows } = req.user;
    if(!_.find(follows, (userId) => userId === req.params.userId)) {
      follows.push(req.params.userId);
    }
    return res.send({ follows });
  })
  .use(notFound);
