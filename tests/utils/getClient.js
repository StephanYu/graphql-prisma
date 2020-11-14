import ApolloBoost from "apollo-boost";

const getClient = (authToken) => {
  return new ApolloBoost({
    uri: "http://localhost:4000",
    request(operation) {
      if (authToken) {
        operation.setContext({
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      }
    },
  });
};

export { getClient as default };
