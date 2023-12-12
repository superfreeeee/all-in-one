import nock from 'nock';
import { xhrAdapter } from '../adapters/xhr';
import { MOCK_SERVER_BASE_URL, mockServer, polyfillNockEnv } from './mockServer';
import { HttpResponse } from '../adapters/type';

beforeAll(() => {
  polyfillNockEnv();
});

beforeEach(() => {
  mockServer();
});

afterAll(() => {
  // avoid blocking jest closing
  nock.abortPendingRequests();
});

describe('xhr tests', () => {
  test('response text', async () => {
    const result = xhrAdapter({
      method: 'GET',
      url: `${MOCK_SERVER_BASE_URL}`,
      responseType: '',
      mimeType: 'text/plain',
    });

    const res = await result.response();

    expect(res.status).toBe(200);
    expect(res.data).toBe('Hello World!');

    const headers = await result.headers();

    expect(headers['content-type']).toBe('text/plain');
  });

  test('response json', async () => {
    const res = await xhrAdapter({
      method: 'GET',
      url: `${MOCK_SERVER_BASE_URL}/json`,
    }).response();

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ content: 'Hello World!' });
    expect(res.headers['content-type']).toBe('application/json');
  });

  test('headers', async () => {
    const response = await xhrAdapter({
      method: 'GET',
      url: `${MOCK_SERVER_BASE_URL}`,
      responseType: '',
      headers: {
        'Custom-Header': 'value',
        Token: 'custom token',
      },
    }).response();

    const requestHeaders = response.config.headers;

    expect(requestHeaders?.['Custom-Header']).toBe('value');
    expect(requestHeaders?.['Token']).toBe('custom token');
  });

  test('timout', async () => {
    try {
      await xhrAdapter({
        method: 'GET',
        url: `${MOCK_SERVER_BASE_URL}/delay`,
        timeout: 100, // timeout in 100ms
      }).response();
      throw new Error('unexpected error');
    } catch (error) {
      expect((error as Error).message.startsWith('Exceeded timeout')).toBe(true);
    }
  });

  test('nework error by invalid host', async () => {
    try {
      await xhrAdapter({
        method: 'GET',
        url: `${MOCK_SERVER_BASE_URL}__invalid`, // invalid host
      }).response();
      throw new Error('unexpected error');
    } catch (error) {
      expect((error as Error).message).toBe('Network error'); // constant message
    }
  });

  test('abort', async () => {
    try {
      const result = xhrAdapter({
        method: 'GET',
        url: `${MOCK_SERVER_BASE_URL}`,
      });
      result.abort(); // abort request
      await result.response();
      throw new Error('unexpected error');
    } catch (error) {
      expect((error as Error).message).toBe('Request aborted'); // constant message
    }
  });

  test('failed with 403', async () => {
    try {
      await xhrAdapter({
        method: 'GET',
        url: `${MOCK_SERVER_BASE_URL}/forbidden`,
        responseType: '',
      }).response();
      throw new Error('unexpected error');
    } catch (error) {
      expect((error as HttpResponse).status).toBe(403);
    }
  });

  test('accept 403', async () => {
    const res = await xhrAdapter({
      method: 'GET',
      url: `${MOCK_SERVER_BASE_URL}/forbidden`,
      responseType: '',
      validateStatus: (status) => [200, 403].includes(status),
    }).response();
    expect(res.status).toBe(403);
  });
});
