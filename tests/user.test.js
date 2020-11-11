import "cross-fetch/polyfill";
import ApolloBoost, { gql } from "apollo-boost";
import prisma from "../src/prisma";
import bcrypt from "bcryptjs";

const client = new ApolloBoost({
  uri: "http://localhost:4000",
});

beforeEach(async () => {
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
  const user = await prisma.mutation.createUser({
    data: {
      name: "Gordon Ryan",
      email: "gordon@dds.com",
      password: bcrypt.hashSync("gordon12"),
    },
  });
  await prisma.mutation.createPost({
    data: {
      title: "PUBLISHED post",
      body: "",
      published: true,
      author: {
        connect: {
          id: user.id,
        },
      },
    },
  });
  await prisma.mutation.createPost({
    data: {
      title: "UNPUBLISHED draft post",
      body: "",
      published: false,
      author: {
        connect: {
          id: user.id,
        },
      },
    },
  });
});

test("Should create a new user", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: { name: "Adam", email: "adam@email.com", password: "adam1234" }
      ) {
        token
        user {
          id
        }
      }
    }
  `;

  const response = await client.mutate({
    mutation: createUser,
  });
  const id = response.data.createUser.user.id;
  const userExists = await prisma.exists.User({ id });

  expect(userExists).toBe(true);
});
