import { HttpHeaders, HttpRequestAdapterResult, HttpRequestConfig, HttpResponse } from './type';

const parseHeaders = (raw: string): HttpHeaders => {
  const headers: HttpHeaders = {};
  if (!raw) {
    return headers;
  }
  for (const line of raw.trim().split(/[\r\n]+/)) {
    const [key, value] = line.split(/:\s*/); // "key: value..."
    headers[key] = value;
  }
  return headers;
};

/**
 * Http request adapter based on XMLHttpRequest object in browser
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest}
 *
 * @param config
 * @returns
 */
export const xhrAdapter = <T>(config: HttpRequestConfig): HttpRequestAdapterResult<T> => {
  let xhr: XMLHttpRequest;
  const requestPromise = new Promise<HttpResponse<T>>(function request(resolve, reject) {
    xhr = new XMLHttpRequest();

    // TODO HTTP basic authentication

    xhr.open(config.method, config.url);

    /**
     * setting fields
     */
    if (config.mimeType) {
      xhr.overrideMimeType(config.mimeType);
    }
    xhr.responseType = config.responseType ?? 'json';
    xhr.timeout = config.timeout ?? 0;

    // TODO request headers
    if (config.headers) {
      for (const key of Object.keys(config.headers)) {
        xhr.setRequestHeader(key, config.headers[key]);
      }
    }

    /**
     * event handlers
     */

    // request success
    xhr.onload = () => {
      const responseType = xhr.responseType;
      const data = responseType === '' || responseType === 'text' ? xhr.responseText : xhr.response;
      const response: HttpResponse<T> = {
        status: xhr.status,
        statusText: xhr.statusText,
        data,
        headers: parseHeaders(xhr.getAllResponseHeaders()),
        responseType,
        config,
      };

      const success = config.validateStatus
        ? config.validateStatus(response.status) //
        : response.status === 200;

      if (success) {
        resolve(response);
      } else {
        reject(response);
      }
    };

    // network error
    xhr.onerror = () => {
      reject(new Error('Network error'));
    };

    // request timeout
    xhr.ontimeout = () => {
      reject(new Error(`Exceeded timeout of ${config.timeout} ms`));
    };

    // request aborted
    xhr.onabort = () => {
      reject(new Error('Request aborted'));
    };

    xhr.send(null);
  });

  return {
    response: () => requestPromise,
    headers: () => requestPromise.then((response) => response.headers),
    abort: () => xhr.abort(),
  };
};
