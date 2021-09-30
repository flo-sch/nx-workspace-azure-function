import {
  runStubFunctionFromBindings,
  createHttpTrigger
} from 'stub-azure-function-context';

import { bindings } from '../../../function1/function.json';
import httpTrigger from './main';

async function mockRequest() {
  return runStubFunctionFromBindings(
    httpTrigger,
    [
      {
        ...bindings[0],
        data: createHttpTrigger('GET', 'http://example.com', {}, {}, undefined, {})
      },
      bindings[1],
    ],
    new Date()
  );
}

describe('apps > function1', () => {
  test('returns an http response', async () => {
    const response = await mockRequest();

    expect(response.status).toBe(200);
    expect(response.headers).toMatchObject({
      'content-type': 'application/json',
    });
    expect(JSON.parse(response.body)).toMatchObject({
      message: expect.stringContaining('Hello from Function 1'),
    });
  });
});
