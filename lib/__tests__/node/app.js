import React from 'react';
import ReactDOMServer from 'react-dom/server';
const { describe, it } = global;
import should from 'should/as-function';

import App from '../fixtures/components/App';
import createFlux from '../fixtures/createFlux';
import ApiServer from '../fixtures/ApiServer';

import Nexus from '../../';

const API_PORT = 7777;

describe('@root', () => {
  it('prepare App on server', async function test() {
    const apiServer = new ApiServer({ port: API_PORT });
    await apiServer.startListening();
    const flux = createFlux({ port: API_PORT });
    const app = <App flux={flux} />;
    await Nexus.prepare(app);
    should(ReactDOMServer.renderToStaticMarkup(app)).be.deepEqual(ReactDOMServer.renderToStaticMarkup(
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
    ));
    await apiServer.stopListening();
  });
  it('dispatches Actions', async function test() {
    const apiServer = new ApiServer({ port: API_PORT });
    await apiServer.startListening();
    const flux = createFlux({ port: API_PORT });
    await flux.dispatchAction('/users/1/delete', {});
    await flux.dispatchAction('/users/create', { userName: 'Marcel', rank: 'Bronze' });
    await flux.dispatchAction('/users/2/update', { userName: 'Carol', rank: 'Diamond' });
    const app = <App flux={flux} />;
    await Nexus.prepare(app);
    should(ReactDOMServer.renderToStaticMarkup(app)).be.deepEqual(ReactDOMServer.renderToStaticMarkup(
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
                <div className='UserId'>{'User #2'}</div>
                <div className='UserName'>{'User Name: Carol'}</div>
                <div className='UserRank'>{'User Rank: Diamond'}</div>
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
                <div className='UserName'>{'User Name: Marcel'}</div>
                <div className='UserRank'>{'User Rank: Bronze'}</div>
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
    ));
    await apiServer.stopListening();
  });
  it('serializes and unserializes state', async function test() {
    const apiServer = new ApiServer({ port: API_PORT });
    await apiServer.startListening();
    const flux = createFlux({ port: API_PORT });
    await flux.dispatchAction('/users/1/delete', {});
    await flux.dispatchAction('/users/create', { userName: 'Marcel', rank: 'Bronze' });
    await flux.dispatchAction('/users/2/update', { userName: 'Carol', rank: 'Diamond' });
    const json = JSON.stringify(flux.dumpState());
    const reflux = createFlux({ port: 7777 }).loadState(JSON.parse(json));
    const app = <App flux={reflux} />;
    await Nexus.prepare(app);
    should(ReactDOMServer.renderToStaticMarkup(app)).be.deepEqual(ReactDOMServer.renderToStaticMarkup(
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
                <div className='UserId'>{'User #2'}</div>
                <div className='UserName'>{'User Name: Carol'}</div>
                <div className='UserRank'>{'User Rank: Diamond'}</div>
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
                <div className='UserName'>{'User Name: Marcel'}</div>
                <div className='UserRank'>{'User Rank: Bronze'}</div>
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
    ));
    await apiServer.stopListening();
  });
});
