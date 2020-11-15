import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import seedDatabase, {
  testUser1,
  testPost1,
  testComment1,
  testComment2,
} from "./utils/seedDatabase";
import getClient from "./utils/getClient";
import { deleteComment, subscribeToComments } from "./utils/gqlOperations";

const client = getClient();
beforeEach(seedDatabase);

test("Should only delete a user's own comment when authenticated", async () => {
  const client = getClient(testUser1.jwt);
  const variables = {
    id: testComment2.comment.id,
  };

  await client.mutate({ mutation: deleteComment, variables });
  const commentExists = await prisma.exists.Comment({
    id: testComment2.comment.id,
  });

  expect(commentExists).toBe(false);
});

test("Should not delete other users' comments", async () => {
  const client = getClient(testUser1.jwt);
  const variables = {
    id: testComment1.comment.id,
  };

  await expect(
    client.mutate({ mutation: deleteComment, variables })
  ).rejects.toThrow();
});

test("Should subscribe to comments for a post", async (done) => {
  const variables = {
    postId: testPost1.post.id,
  };
  client.subscribe({ query: subscribeToComments, variables }).subscribe({
    next(response) {
      expect(response.data.comment.mutation).toBe("DELETED");
      done();
    },
  });

  await prisma.mutation.deleteComment({
    where: { id: testComment1.comment.id },
  });
});

// -----------------------------
// Additional tests for Comments
// -----------------------------

// Should fetch post comments

// Should create a new comment

// Should not create comment on draft post

// Should update comment

// Should not update another users comment

// Should not delete another users comment

// Should require authentication to create a comment (could add for update and delete too)
