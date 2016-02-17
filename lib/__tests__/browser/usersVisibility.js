import cheerio from 'cheerio';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import should from 'should/as-function';

import RenderServer from '../fixtures/RenderServer';
import ApiServer from '../fixtures/ApiServer';

const { load } = cheerio;
const TIME_OUT = 250;

function removeReactAttributes(html) {
  return html.replace(/ (data-reactid|data-react-checksum)=".*?"/g, '');
}

const { after, before, describe, it, browser } = global;
describe('[FT] Users Visibility', () => {

  let renderServer = null;
  let apiServer = null;

  before(async function $before(done) {
    apiServer = new ApiServer({ port: 0 });
    await apiServer.startListening();
    const { port: apiPort } = apiServer.server.address();

    renderServer = new RenderServer({ port: 0, apiPort });
    await renderServer.startListening();
    const { port: renderPort } = renderServer.server.address();

    await browser.url(`http://localhost:${renderPort}`);
    done();
  });
  after(async function $after(done) {
    await renderServer.stopListening();
    await apiServer.stopListening();
    done();
  });

  it('should dispatch UsersVisibility action and check if the users list has been hidden', () => {
    const expectedAppHtml = load(ReactDOMServer.renderToStaticMarkup(
    <div id='__App__'>
      <div className='App'>
        <div>
          <div>
            <button id='UsersVisibility'>
              {'Show/Hide Users'}
            </button>
          </div>
          <input id='InputUserName' placeholder='User Name' value=''/>
          <input id='InputUserRank' placeholder='Rank' value=''/>
          <button id='CreateUser'>{'Create New User'}</button>
        </div>
      </div>
    </div>)).html();
    return browser
      .click('#UsersVisibility')
      .pause(TIME_OUT)
      .getHTML('#__App__', (err, appHtml) => {
        if(err) {
          return err;
        }
        should(load(removeReactAttributes(appHtml)).html()).be.equal(expectedAppHtml);
      });
  });

});
