import { graphql, buildSchema } from 'graphql';
import resolvers from '../resolvers'; // Importe seus resolvers

const schema = buildSchema(`
  type Customer {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    getCustomer(id: ID!): Customer
  }
`);

describe('Customer Resolvers', () => {
  it('should retrieve a user by ID', async () => {
    const mockCustomer = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    // Configurando o resolver para retornar o cliente simulado
    resolvers.Query.getCustomer = jest.fn(({ id }) =>
      id === '1' ? Promise.resolve(mockCustomer) : Promise.resolve(null)
    );

    const query = `
      query {
        getCustomer(id: "1") {
          id
          name
          email
        }
      }
    `;

    const result = await graphql({
      schema,
      source: query,
      rootValue: resolvers,
    });

    expect(result.data?.getCustomer).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    });
    expect(resolvers.Query.getCustomer).toHaveBeenCalledWith({ id: '1' });
  });
});
