import ApiServer from './ApiServer';
import RenderServer from './RenderServer';

async function startServersAndBrowse(browser) {
  const apiServer = new ApiServer({ port: 0 });
  await apiServer.startListening();
  const { port: apiPort } = apiServer.server.address();

  const renderServer = new RenderServer({ port: 0, apiPort });
  await renderServer.startListening();
  const { port: renderPort } = renderServer.server.address();
  await browser.url(`http://localhost:${renderPort}`);

  return () =>
    Promise.all([renderServer.stopListening(), apiServer.stopListening()]);
}

export default startServersAndBrowse;
