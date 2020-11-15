import prisma from "../../src/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const testUser1 = {
  input: {
    name: "Gordon Ryan",
    email: "gordon@dds.com",
    password: bcrypt.hashSync("gordon12"),
  },
  user: undefined,
  jwt: undefined,
};

const testUser2 = {
  input: {
    name: "Andre Galvao",
    email: "andre@atos.com",
    password: bcrypt.hashSync("andre123"),
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

const testComment1 = {
  input: {
    text: "First comment",
  },
  comment: undefined,
};

const testComment2 = {
  input: {
    text: "Second comment",
  },
  comment: undefined,
};

const seedDatabase = async () => {
  // Delete test data
  await prisma.mutation.deleteManyComments();
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // Create testUser1, testUser2 and assign jwt auth tokens to each user
  testUser1.user = await prisma.mutation.createUser({
    data: testUser1.input,
  });
  testUser1.jwt = jwt.sign({ uId: testUser1.user.id }, process.env.JWT_SECRET);

  testUser2.user = await prisma.mutation.createUser({
    data: testUser2.input,
  });
  testUser2.jwt = jwt.sign({ uId: testUser2.user.id }, process.env.JWT_SECRET);

  // Create test posts by testUser 1
  testPost1.post = await prisma.mutation.createPost({
    data: {
      ...testPost1.input,
      author: {
        connect: {
          id: testUser1.user.id,
        },
      },
    },
  });
  testPost2.post = await prisma.mutation.createPost({
    data: {
      ...testPost2.input,
      author: {
        connect: {
          id: testUser1.user.id,
        },
      },
    },
  });

  // Create test comments by testUser1, testUser2 on published testPost1
  testComment1.comment = await prisma.mutation.createComment({
    data: {
      ...testComment1.input,
      author: {
        connect: {
          id: testUser2.user.id,
        },
      },
      post: {
        connect: {
          id: testPost1.post.id,
        },
      },
    },
  });
  testComment2.comment = await prisma.mutation.createComment({
    data: {
      ...testComment2.input,
      author: {
        connect: {
          id: testUser1.user.id,
        },
      },
      post: {
        connect: {
          id: testPost1.post.id,
        },
      },
    },
  });
};

export {
  seedDatabase as default,
  testUser1,
  testUser2,
  testPost1,
  testPost2,
  testComment1,
  testComment2,
};
