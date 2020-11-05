import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
  updateUser(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updateUser(
      {
        where: {
          id,
        },
        data,
      },
      info
    );
  },
  deleteUser(parent, { id }, { prisma }, info) {
    return prisma.mutation.deleteUser(
      {
        where: {
          id,
        },
      },
      info
    );
  },
  createPost(parent, { data }, { prisma }, info) {
    return prisma.mutation.createPost(
      {
        data: {
          title: data.title,
          body: data.body,
          published: data.published,
          author: {
            connect: {
              id: data.author,
            },
          },
        },
      },
      info
    );
  },
  updatePost(parent, { id, data }, { prisma }, info) {
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
  deletePost(parent, { id }, { prisma }, info) {
    return prisma.mutation.deletePost(
      {
        where: {
          id,
        },
      },
      info
    );
  },
  createComment(parent, { data }, { prisma }, info) {
    return prisma.mutation.createComment(
      {
        data: {
          text: data.text,
          author: {
            connect: {
              id: data.author,
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
  updateComment(parent, { id, data }, { prisma }, info) {
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
  deleteComment(parent, { id }, { prisma }, info) {
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
