import {
  app,
  HttpRequest,
  HttpResponse,
  InvocationContext,
} from '@azure/functions';
import {core} from '@flosch/core';

export async function handler(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponse> {
  context.debug('function3.handler', request.method, request.url);

  return new HttpResponse({
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
    jsonBody: {
      message: `Hello from Function 3 - ${core()}`,
    },
  });
}

app.http('function3', {
  authLevel: 'anonymous',
  methods: ['GET'],
  handler,
});
