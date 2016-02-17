import cheerio from 'cheerio';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import should from 'should/as-function';

import RenderServer from '../fixtures/RenderServer';
import ApiServer from '../fixtures/ApiServer';

const { load } = cheerio;

function removeReactAttributes(html) {
  return html.replace(/ (data-reactid|data-react-checksum)=".*?"/g, '');
}

const { after, before, describe, it, browser } = global;
describe('[FT] Rendered Page', () => {

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

  it('should title return the value correctly', () =>
    browser
      .getTitle((err, title) => {
        if(err) {
          return err;
        }
        should(title).be.equal('UserList');
      })
  );

  it('should __NEXUS_PAYLOAD__ property exists on the window object', () =>
    browser
      .execute(() => window.__NEXUS_PAYLOAD__, (err, value) => {
        if(err) {
          return err;
        }
        return value;
      }).then(({ value: nexusPayload }) => {
        should.exist(nexusPayload);
      })
  );

  it('should <script> balises be equal to 3', () => {
    const expectedDomScriptsLength = 3;
    return browser
      .getHTML('script', (err, domScripts) => {
        if(err) {
          return err;
        }
        should(domScripts.length).be.equal(expectedDomScriptsLength);
      });
  });

  it('should #__App__ exists and its content should be correctly rendered', () => {
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
            <li>
              <div className='User'>
                <div className='UserId'>{'User #2'}</div>
                <div className='UserName'>{'User Name: Matthieu'}</div>
                <div className='UserRank'>{'User Rank: Silver'}</div>
                <button>{'X'}</button>
                <div>
                  <input id='InputUserName-2' placeholder='Updated Name' value=''/>
                  <input id='InputUserRank-2' placeholder='Updated Rank' value=''/>
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
      .isExisting('#__App__', (isExisting) => should(isExisting).be.ok)
      .getHTML('#__App__', (err, appHtml) => {
        if(err) {
          return err;
        }
        should(load(removeReactAttributes(appHtml)).html()).be.equal(expectedAppHtml);
      });
  });

});
