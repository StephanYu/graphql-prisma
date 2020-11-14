import prisma from "../../src/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const testUser = {
  input: {
    name: "Gordon Ryan",
    email: "gordon@dds.com",
    password: bcrypt.hashSync("gordon12"),
  },
  user: undefined,
  jwt: undefined,
};

const testPost1 = {
  input: {
    title: "PUBLISHED post",
    body: "",
    published: true,
  },
  post: undefined,
};

const testPost2 = {
  input: {
    title: "UNPUBLISHED draft post",
    body: "",
    published: false,
  },
  post: undefined,
};

const seedDatabase = async () => {
  // Delete test data
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // Create test user and assign jwt auth token
  testUser.user = await prisma.mutation.createUser({
    data: testUser.input,
  });
  testUser.jwt = jwt.sign({ uId: testUser.user.id }, process.env.JWT_SECRET);

  testPost1.post = await prisma.mutation.createPost({
    data: {
      ...testPost1.input,
      author: {
        connect: {
          id: testUser.user.id,
        },
      },
    },
  });
  testPost2.post = await prisma.mutation.createPost({
    data: {
      ...testPost2.input,
      author: {
        connect: {
          id: testUser.user.id,
        },
      },
    },
  });
};

export { seedDatabase as default, testUser, testPost1, testPost2 };
