const { describe, it } = global;
import React from 'react';
import { renderToStaticMarkup } from '../';
import Root from './Root';
import should from 'should';

describe('renderToStaticMarkup', function test() {
  this.timeout(5000);
  it('should render the correct HTML and data', () =>
    renderToStaticMarkup(<Root path={'Königsberg'} mood={'happy'} foo={'bar'} />)
      .then(({ html, data }) => {
        should(html).be.exactly([
          '<div class="Root">',
          '<p>Route is Königsberg. User is <span>Kant. Immanuel Kant</span>.</p>',
          '<ul>',
          '<li>Immanuel Kant</li>',
          '<li>Friedrich Nietzsche</li>',
          '</ul>',
          '</div>',
        ].join(''));
        should(JSON.stringify(data)).be.exactly(JSON.stringify({
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
      })
      .catch((err) => { throw err; })
  );
});
