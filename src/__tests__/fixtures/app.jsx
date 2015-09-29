import _ from 'lodash';
import express from 'express';

export const users = [
  {
    userId: 'CategoricalDude',
    userName: 'Immanuel Kant',
    profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Immanuel_Kant_%28painted_portrait%29.jpg',
  },
  {
    userId: '!@#',
    userName: 'Frierich Nietzsche',
    profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Nietzsche187a.jpg',
  },
  {
    userId: 'b@d_s@nt@',
    userName: 'Plato',
    profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Plato_Silanion_Musei_Capitolini_MC1377.jpg',
  },
];

export const authTokens = [
  {
    authToken: 'E47Exd7RdDds',
    userId: '!@#',
  },
];

export default express()
  .get('/users', (req, res) =>
    res.send(users)
  )
  .get('/users/:userId', (req, res) => {
    const user = _.find(users, ({ userId }) => userId === req.params.userId);
    if(!users) {
      return res.sendStatus(404);
    }
    return res.send(user);
  })
  .get('/me', (req, res) => {
    const token = _.find(authTokens, ({ authToken }) => authToken === req.query.authToken);
    if(!token) {
      return res.sendStatus(401);
    }
    const user = _.find(users, ({ userId }) => userId === token.userId);
    if(!user) {
      return res.sendStatus(500);
    }
    return res.send(user);
  });
