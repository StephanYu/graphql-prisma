import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import prisma from "../src/prisma";
import seedDatabase, {
  testUser,
  testPost1,
  testPost2,
} from "./utils/seedDatabase";
import getClient from "./utils/getClient";
import {
  getPosts,
  getMyPosts,
  updatePost,
  createPost,
  deletePost,
} from "./utils/gqlOperations";

const client = getClient();

beforeEach(seedDatabase);

test("Should expose only published posts", async () => {
  const { data } = await client.query({ query: getPosts });

  expect(data.posts.length).toBe(1);
  expect(data.posts[0].published).toBe(true);
});

test("Should fetch all posts when the user is authenticated", async () => {
  const client = getClient(testUser.jwt);
  const { data } = await client.query({ query: getMyPosts });

  expect(data.myPosts.length).toBe(2);
  expect(data.myPosts[0].author.id).toBe(testUser.user.id);
  expect(data.myPosts[1].author.id).toBe(testUser.user.id);
});

test("Should update own post when the user is authenticated", async () => {
  const client = getClient(testUser.jwt);
  const variables = {
    id: testPost1.post.id,
    data: {
      published: false,
    },
  };

  const { data } = await client.mutate({ mutation: updatePost, variables });
  const exists = await prisma.exists.Post({
    id: testPost1.post.id,
    published: false,
  });

  expect(data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
});

test("Should create a new post when authenticated", async () => {
  const client = getClient(testUser.jwt);
  const variables = {
    data: {
      title: "A new post",
      body: "This is a post",
      published: true,
    },
  };
  const { data } = await client.mutate({ mutation: createPost, variables });

  expect(data.createPost.title).toBe("A new post");
  expect(data.createPost.body).toBe("This is a post");
  expect(data.createPost.published).toBe(true);
});

test("Should delete a post when authenticated", async () => {
  const client = getClient(testUser.jwt);
  const variables = {
    id: testPost2.post.id,
  };

  await client.mutate({ mutation: deletePost, variables });
  const deletedPostExists = await prisma.exists.Post({ id: testPost2.post.id });

  expect(deletedPostExists).toBe(false);
});
