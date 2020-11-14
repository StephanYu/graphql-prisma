import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import seedDatabase, { testUser } from "./utils/seedDatabase";
import getClient from "./utils/getClient";
import {
  createUser,
  getUsers,
  loginUser,
  getMyProfile,
} from "./utils/gqlOperations";

const client = getClient();

beforeEach(seedDatabase);

test("Should create a new user", async () => {
  const variables = {
    data: {
      name: "Garry",
      email: "garry@dds.com",
      password: "garry123",
    },
  };

  const { data } = await client.mutate({
    mutation: createUser,
    variables,
  });
  const id = data.createUser.user.id;
  const userExists = await prisma.exists.User({ id });

  expect(userExists).toBe(true);
});

test("Should expose only public fields of user profiles", async () => {
  const { data } = await client.query({ query: getUsers });

  expect(data.users.length).toBe(1);
  expect(data.users[0].email).toBe(null);
  expect(data.users[0].name).toBe("Gordon Ryan");
});

test("Should not login user with incorrect credentials", async () => {
  const variables = {
    data: {
      email: "gordon@dds.com",
      password: "incorrect_password",
    },
  };

  await expect(
    client.mutate({ mutation: loginUser, variables })
  ).rejects.toThrow();
});

test("Should not sign up user with invalid password", async () => {
  const variables = {
    data: {
      name: "Gordon Ryan",
      email: "gordon@dds.com",
      password: "2short",
    },
  };

  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow();
});

test("Should fetch user profile when auth token is provided", async () => {
  const client = getClient(testUser.jwt);
  const { data } = await client.query({ query: getMyProfile });

  expect(data.myProfile.id).toBe(testUser.user.id);
  expect(data.myProfile.name).toBe(testUser.user.name);
  expect(data.myProfile.email).toBe(testUser.user.email);
});
