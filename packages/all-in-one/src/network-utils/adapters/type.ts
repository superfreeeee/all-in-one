export type HttpRequestAdapter<T> = (config: HttpRequestConfig) => HttpRequestAdapterResult<T>;

/**
 * Http Request abstract
 */
export type HttpRequestConfig = {
  /**
   * Http method
   */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /**
   * Request url
   */
  url: string;
  /**
   * Specific request headers
   */
  headers?: HttpHeaders;
  /**
   * Specific MIME type
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/overrideMimeType}
   */
  mimeType?: string;
  /**
   * Expected response type
   *
   * @default 'json'
   */
  responseType?: XMLHttpRequestResponseType;
  /**
   * Enable cross-origin site setting cookie
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials}
   *
   * @default true
   */
  withCredentials?: boolean;
  /**
   * timeout in ms to abort request
   *
   * @default 0
   */
  timeout?: number;
  /**
   * determinate whether status should be resolved or rejected
   *
   * @param status
   * @returns
   */
  validateStatus?: (status: number) => boolean;
};

export type HttpRequestAdapterResult<T> = {
  response: () => Promise<HttpResponse<T>>;
  headers: () => Promise<HttpHeaders>;
  abort: VoidFunction;
};

/**
 * Http Response abstract
 */
export type HttpResponse<T = any> = {
  /**
   * Http status code
   */
  status: number;
  /**
   * Http status text
   */
  statusText: string;
  /**
   * Http response type
   */
  responseType: XMLHttpRequestResponseType;
  /**
   * response body
   */
  data: T;
  /**
   * response headers
   */
  headers: HttpHeaders;
  /**
   * Request config
   */
  config: HttpRequestConfig;
};

/**
 * Http headers
 */
export type HttpHeaders = {
  [key: string]: string;
};
