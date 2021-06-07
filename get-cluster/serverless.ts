import type { AWS } from '@serverless/typescript';

import getCluster from '@functions/getCluster';
import getTimestamp from '@functions/getTimestamp';

const serverlessConfiguration: AWS = {
  service: 'get-cluster',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'ap-northeast-1',
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['eks:ListClusters', 'eks:DescribeCluster'],
            Resource: '*',
          },
        ],
      },
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { getCluster, getTimestamp },
};

module.exports = serverlessConfiguration;
