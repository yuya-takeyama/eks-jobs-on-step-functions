import 'source-map-support/register';

import { Handler } from 'aws-lambda';

export const main: Handler = async (_event: any) => {
  return Math.floor(Date.now() / 1000);
};
