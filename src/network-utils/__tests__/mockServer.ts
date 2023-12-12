import nock from 'nock';

export const MOCK_SERVER_BASE_URL = 'https://test.example.com';

declare global {
  interface Window {
    setImmediate: any;
    clearImmediate: any;
  }
}

export const polyfillNockEnv = () => {
  if (!window.setImmediate) {
    window.setImmediate = window.setTimeout;
  }
  if (!window.clearImmediate) {
    window.clearImmediate = window.clearTimeout;
  }
};

export const mockServer = (enableCORS: boolean = true) => {
  const scope = nock(MOCK_SERVER_BASE_URL);

  if (enableCORS) {
    scope.defaultReplyHeaders({
      'access-control-allow-origin': '*',
      'access-control-allow-headers': '*',
      'access-control-allow-credentials': 'true',
    });
  }

  // mock text response
  scope.get('/').delay(100).reply(200, 'Hello World!', {
    'content-type': 'text/plain',
  });

  scope.options('/').reply(200);

  // mock json response
  scope.get('/json').reply(
    200, //
    { content: 'Hello World!' },
    { 'content-type': 'application/json' },
  );

  // mock delay response
  scope
    .get('/delay')
    .delay(200) // response in 200ms
    .reply(200);

  // mock CORS response
  scope
    .get('/forbidden')
    .delay(50) // response in 50ms
    .reply(403, 'access forbidden');

  return scope;
};
