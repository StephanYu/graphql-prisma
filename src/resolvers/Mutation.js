import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getUserId from "../utils/getUserId";

const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    if (data.password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    const password = await bcrypt.hash(data.password, 10);
    const user = await prisma.mutation.createUser({
      data: {
        ...data,
        password,
      },
    });

    return {
      user,
      token: jwt.sign({ uId: user.id }, "mysecret"),
    };
  },
  async loginUser(parent, { data }, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new Error("User login failed");
    }
    const isPwdMatch = await bcrypt.compare(data.password, user.password);

    if (!isPwdMatch) {
      throw new Error("User login failed");
    }

    return {
      user,
      token: jwt.sign({ uId: user.id }, "mysecret"),
    };
  },
  updateUser(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId,
        },
        data,
      },
      info
    );
  },
  deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId,
        },
      },
      info
    );
  },
  createPost(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createPost(
      {
        data: {
          title: data.title,
          body: data.body,
          published: data.published,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      },
      info
    );
  },
  async updatePost(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId,
      },
    });

    if (!postExists) {
      throw new Error("Unable to find post");
    }

    return prisma.mutation.updatePost(
      {
        where: {
          id,
        },
        data: {
          title: data.title,
          body: data.body,
          published: data.published,
        },
      },
      info
    );
  },
  async deletePost(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId,
      },
    });
    if (!postExists) {
      throw new Error("Unable to find post");
    }

    return prisma.mutation.deletePost(
      {
        where: {
          id,
        },
      },
      info
    );
  },
  createComment(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createComment(
      {
        data: {
          text: data.text,
          author: {
            connect: {
              id: userId,
            },
          },
          post: {
            connect: {
              id: data.post,
            },
          },
        },
      },
      info
    );
  },
  async updateComment(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId,
      },
    });

    if (!commentExists) {
      throw new Error("Unable to update comment");
    }
    return prisma.mutation.updateComment(
      {
        where: {
          id,
        },
        data,
      },
      info
    );
  },
  async deleteComment(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId,
      },
    });

    if (!commentExists) {
      throw new Error("Unable to delete comment");
    }

    return prisma.mutation.deleteComment(
      {
        where: {
          id,
        },
      },
      info
    );
  },
};

export { Mutation as default };
