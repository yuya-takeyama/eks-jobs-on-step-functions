import 'source-map-support/register';

import { Handler } from 'aws-lambda';
import {
  EKSClient,
  paginateListClusters,
  DescribeClusterCommand,
} from '@aws-sdk/client-eks';

export const main: Handler = async event => {
  const client = new EKSClient({ region: process.env.AWS_REGION });
  const paginator = paginateListClusters({ client, pageSize: 25 }, {});

  for await (const page of paginator) {
    const promises = (page.clusters || []).map(name =>
      client.send(new DescribeClusterCommand({ name })),
    );
    const clusterRes = await Promise.all(promises);
    for (const res of clusterRes) {
      if (tagsMatches(res.cluster?.tags || {}, event.clusterTags)) {
        return res.cluster;
      }
    }
  }
};

type ClusterTags = { [key: string]: string };

const tagsMatches = (tags: ClusterTags, criteria: ClusterTags): boolean => {
  for (const [key, value] of Object.entries(criteria)) {
    if (tags[key] !== value) {
      return false;
    }
  }

  return true;
};
