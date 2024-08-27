const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllPublishedPosts = async () => {
  const result = await prisma.post.findMany({
    where: {
      isPublished: true,
    },
    select: {
      id: true,
      title: true,
      author: true,
      creationDate: true,
      categories: true,
    },
  });
  return result;
};
const getPost = async (postId) => {
  const processedPostId = parseInt(postId);
  const result = await prisma.post.findUnique({
    where: {
      id: processedPostId,
    },
    include: {
      comments: true,
      categories: true,
      author: true,
    },
  });
  return result;
};
const getAllCategories = async () => {
  result = await prisma.category.findMany({
    include: {
      name: true,
      id: true,
    },
  });
};
const addComment = async (postId, author, comment) => {
  const processedPostId = parseInt(postId);
  await prisma.comment.create({
    data: {
      authorName: author,
      postId: processedPostId,
      comment: comment,
    },
  });
};
const addUser = async (name, password) => {
  let processedName = name.toLowerCase();
  await prisma.user.create({
    data: {
      name: processedName,
      password: password,
    },
  });
  return;
};
const getPostsOfUsers = async (userId) => {
  let processedUserId = parseInt(userId);
  let result = await prisma.post.findMany({
    where: {
      authorId: processedUserId,
    },
    include: {
      id: true,
      title: true,
      creationTime: true,
      categories: true,
    },
  });
  return result;
};
const addPost = async (userId, title, content, categories, publishStatus) => {
  const processedUserId = parseInt(userId);
  let categoriesCreateArray = [];
  for (let categoryId of categories) {
    let processedCategoryId = parseInt(categoryId);
    categoriesCreateArray.push({ category: { connect: processedCategoryId } });
  }
  await prisma.post.create({
    data: {
      title: title,
      content: content,
      userId: processedUserId,
      categories: {
        create: categoriesCreateArray,
      },
      isPublished: publishStatus,
    },
  });
};
const editPost = async (
  userId,
  title,
  content,
  categories,
  publishStatus,
  postId
) => {
  const processedPostId = parseInt(postId);
  const processedUserId = parseInt(userId);
  let categoriesCreateArray = [];
  for (let categoryId of categories) {
    let processedCategoryId = parseInt(categoryId);
    categoriesCreateArray.push({ category: { connect: processedCategoryId } });
  }
  await prisma.post.update({
    where: {
      id: processedPostId,
    },
    data: {
      title: title,
      content: content,
      userId: processedUserId,
      categories: {
        create: categoriesCreateArray,
      },
      isPublished: publishStatus,
    },
  });
};
const deletePost = async (postId) => {
  let processedPostId = parseInt(postId);
  await prisma.comment.deleteMany({
    where: {
      postId: processedPostId,
    },
  });
  await prisma.post.delete({
    where: {
      id: processedPostId,
    },
  });
};
const deleteComment = async (commentId) => {
  let processedCommentId = parseInt(commentId);
  await prisma.comment.delete({
    where: {
      id: processedCommentId,
    },
  });
};

module.exports = {
  getAllPublishedPosts,
  getPost,
  getAllCategories,
  addComment,
  addUser,
  getPostsOfUsers,
  addPost,
  editPost,
  deletePost,
  deleteComment,
};
