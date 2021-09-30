import { AzureFunction } from '@azure/functions';
import { core } from '@flosch/core';

interface HttpResponse {
  body: string;
  headers: Record<string, string>;
  status?: number;
}

const httpTrigger: AzureFunction = async function (): Promise<HttpResponse> {
  return {
    body: JSON.stringify({
      message: `Hello from Function 1 - ${core()}`,
    }),
    headers: {
      'content-type': 'application/json',
    },
    status: 200,
  };
};

export default httpTrigger;
