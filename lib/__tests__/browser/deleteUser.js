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
describe('[FT] Delete User', () => {

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

  it('should dispatch deleteUser action and check if a user has been deleted', () => {
    const expectedAppHtml = load(ReactDOMServer.renderToStaticMarkup(
    <div id='__App__'>
      <div className='App'>
        <div>
          <div>
            <button id='UsersVisibility'>
              {'Show/Hide Users'}
            </button>
          </div>
          <ul className='Users'>
            <li>
              <div className='User'>
                <div className='UserId'>{'User #1'}</div>
                <div className='UserName'>{'User Name: Martin'}</div>
                <div className='UserRank'>{'User Rank: Gold'}</div>
                <button>{'X'}</button>
                <div>
                  <input id='InputUserName-1' placeholder='Updated Name' value=''/>
                  <input id='InputUserRank-1' placeholder='Updated Rank' value=''/>
                  <button>{'Update'}</button>
                </div>
              </div>
            </li>
          </ul>
          <input id='InputUserName' placeholder='User Name' value=''/>
          <input id='InputUserRank' placeholder='Rank' value=''/>
          <button id='CreateUser'>{'Create New User'}</button>
        </div>
      </div>
    </div>)).html();
    return browser
      .click('.Users li:last-child > div > button')
      .pause(TIME_OUT)
      .getHTML('#__App__', (err, appHtml) => {
        if(err) {
          return err;
        }
        should(load(removeReactAttributes(appHtml)).html()).be.equal(expectedAppHtml);
      });
  });

});
