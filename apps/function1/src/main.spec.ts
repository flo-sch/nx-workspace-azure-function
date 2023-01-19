import {HttpRequest, InvocationContext} from '@azure/functions';
import {handler} from './main';

function createTestInvocationContext(): InvocationContext {
  return new InvocationContext({
    functionName: 'function1',
    invocationId: 'mockedInvocationId',
    logHandler: (level, ...args) => {
      switch (level) {
        case 'error':
          console.error(...args);
          break;
        case 'warning':
          console.warn(...args);
          break;
        default:
          console.log(...args);
      }
    },
  });
}

describe('apps > function1', () => {
  test('returns an http response', async () => {
    const request = new HttpRequest({
      method: 'GET',
      url: 'http://localhost:7071/api/function1',
    });
    const response = await handler(request, createTestInvocationContext());

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toEqual('application/json');

    const body = await response.json();
    expect(body).toMatchObject({
      message: expect.stringContaining('Hello from Function 1'),
    });
  });
});
