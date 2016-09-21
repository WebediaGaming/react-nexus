import cheerio from 'cheerio';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import should from 'should/as-function';

import startServersAndBrowse from '../fixtures/startServersAndBrowse';

const { load } = cheerio;
const TIME_OUT = 250;

function removeReactAttributes(html) {
  return html.replace(/ (data-reactid|data-react-checksum|data-reactroot)=".*?"/g, '');
}

const { after, before, describe, it, browser } = global;
describe('[FT] Create User', () => {

  let stopServers = null;

  before(async function $before(done) {
    stopServers = await startServersAndBrowse(browser);
    done();
  });
  after(async function $after() {
    return await stopServers();
  });

  it('should dispatch createUser action and check if a new user has been added', () => {
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
            <li>
              <div className='User'>
                <div className='UserId'>{'User #3'}</div>
                <div className='UserName'>{'User Name: Nicolas'}</div>
                <div className='UserRank'>{'User Rank: Diamond'}</div>
                <button>{'X'}</button>
                <div>
                  <input id='InputUserName-3' placeholder='Updated Name' value=''/>
                  <input id='InputUserRank-3' placeholder='Updated Rank' value=''/>
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
      .waitForExist('#CreateUser')
      .setValue('#InputUserName', 'Nicolas')
      .setValue('#InputUserRank', 'Diamond')
      .click('#CreateUser')
      .pause(TIME_OUT)
      .getHTML('#__App__', (err, appHtml) => {
        if(err) {
          return err;
        }
        should(load(removeReactAttributes(appHtml)).html()).be.equal(expectedAppHtml);
      });
  });

});
