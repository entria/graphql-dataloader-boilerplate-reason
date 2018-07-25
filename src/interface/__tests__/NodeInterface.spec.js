import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { schema } from '../../schema';
import {
  getContext,
  connectMongoose,
  clearDbAndRestartCounters,
  disconnectMongoose,
  createRows,
} from '../../../test/helper';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should load User', async () => {
  const user = await createRows.createUser();

  // language=GraphQL
  const query = `
    query Q {
      node(id: "${toGlobalId('User', user._id)}") {
        ... on User {
          name
        }
      }
    }
  `;

  const rootValue = {};
  const context = getContext();

  const result = await graphql(schema, query, rootValue, context);
  const { node } = result.data;

  expect(node.name).toBe(user.name);
});
