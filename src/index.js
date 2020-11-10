import "@babel/polyfill/noConflict";
import { GraphQLServer } from "graphql-yoga";
import prisma from "./prisma";
import { resolvers, fragmentReplacements } from "./resolvers/index";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  fragmentReplacements,
  context(request) {
    return {
      prisma,
      request,
    };
  },
});

const port = process.env.PORT || 4000;
server.start({ port }, () => {
  console.log(`Server is running on ${port}`);
});
