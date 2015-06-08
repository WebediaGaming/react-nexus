import React from 'react';
import { renderToStaticMarkup } from '../';
import Root from './test/Root';

renderToStaticMarkup(<Root path={'Königsberg'} mood={'happy'} foo={'bar'} />)
.then(({ html, data }) => {
  html.should.be.exactly([
    '<div class="Root">',
      '<p>Route is Königsberg. User is <span>Kant. Immanuel Kant</span>.</p>',
      '<ul>',
        '<li>Immanuel Kant</li>',
        '<li>Friedrich Nietzsche</li>',
      '</ul>',
    '</div>',
  ].join(''));
  JSON.stringify(data).should.be.exactly(JSON.stringify({
    local: {
      '/route': {
        'path': 'Königsberg',
      },
      '/session': {
        'userId': 1,
      },
      '/users/1': {
        firstName: 'Immanuel',
        lastName: 'Kant',
      },
      '/users': {
        '1': 1,
        '2': 2,
      },
      '/users/2': {
        firstName: 'Friedrich',
        lastName: 'Nietzsche',
      },
    },
  }));
  console.log(html);
  console.log(JSON.stringify(data, null, 2));
})
.catch((err) => { throw err; });
