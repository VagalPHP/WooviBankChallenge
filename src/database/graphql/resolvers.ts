const resolvers = {
  Query: {
    getCustomer: async (
      _: any,
      { id }: { id: string },
      { dataSources }: any
    ) => {
      return dataSources.customerAPI.getCustomerById(id);
    },
    getAccount: async (
      _: any,
      { id }: { id: string },
      { dataSources }: any
    ) => {
      return dataSources.accountAPI.getAccountById(id);
    },
    getTransaction: async (
      _: any,
      { id }: { id: string },
      { dataSources }: any
    ) => {
      return dataSources.transactionAPI.getTransactionById(id);
    },
  },

  Mutation: {
    createCustomer: async (
      _: any,
      { name, email }: { name: string; email: string },
      { dataSources }: any
    ) => {
      return dataSources.customerAPI.createCustomer({ name, email });
    },
    createAccount: async (
      _: any,
      { customerId, balance }: { customerId: string; balance: number },
      { dataSources }: any
    ) => {
      return dataSources.accountAPI.createAccount({ customerId, balance });
    },
    createTransaction: async (
      _: any,
      { accountId, amount }: { accountId: string; amount: number },
      { dataSources }: any
    ) => {
      return dataSources.transactionAPI.createTransaction({
        accountId,
        amount,
      });
    },
    addFavoriteAccount: async (
      _: any,
      {
        accountId,
        favoriteAccountId,
      }: { accountId: string; favoriteAccountId: string },
      { dataSources }: any
    ) => {
      return dataSources.accountFavoritesAPI.addFavorite({
        accountId,
        favoriteAccountId,
      });
    },
  },

  Customer: {
    accounts: async (customer: any, _: any, { dataSources }: any) => {
      return dataSources.accountAPI.getAccountsByCustomerId(customer.id);
    },
  },

  Account: {
    customer: async (account: any, _: any, { dataSources }: any) => {
      return dataSources.customerAPI.getCustomerById(account.customerId);
    },
    transactions: async (account: any, _: any, { dataSources }: any) => {
      return dataSources.transactionAPI.getTransactionsByAccountId(account.id);
    },
    favorites: async (account: any, _: any, { dataSources }: any) => {
      return dataSources.accountFavoritesAPI.getFavoritesByAccountId(
        account.id
      );
    },
  },
};

export default resolvers;
