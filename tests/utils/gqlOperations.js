import { gql } from "apollo-boost";

const createUser = gql`
  mutation($data: CreateUserInput!) {
    createUser(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const getUsers = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;

const loginUser = gql`
  mutation($data: LoginUserInput) {
    loginUser(data: $data) {
      token
    }
  }
`;

const getMyProfile = gql`
  query {
    myProfile {
      id
      name
      email
    }
  }
`;

const getPosts = gql`
  query {
    posts {
      id
      title
      published
    }
  }
`;

const getMyPosts = gql`
  query {
    myPosts {
      id
      title
      author {
        id
        name
      }
    }
  }
`;

const updatePost = gql`
  mutation($id: ID!, $data: UpdatePostInput!) {
    updatePost(id: $id, data: $data) {
      id
      title
      body
      published
    }
  }
`;

const createPost = gql`
  mutation($data: CreatePostInput!) {
    createPost(data: $data) {
      id
      title
      body
      published
    }
  }
`;

const deletePost = gql`
  mutation($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

const deleteComment = gql`
  mutation($id: ID!) {
    deleteComment(id: $id) {
      id
    }
  }
`;

const subscribeToComments = gql`
  subscription($postId: ID!) {
    comment(postId: $postId) {
      mutation
      node {
        id
        text
      }
    }
  }
`;

const subscribeToPosts = gql`
  subscription {
    post {
      mutation
    }
  }
`;

export {
  createUser,
  getUsers,
  loginUser,
  getMyProfile,
  getPosts,
  getMyPosts,
  updatePost,
  createPost,
  deletePost,
  deleteComment,
  subscribeToComments,
  subscribeToPosts,
};
