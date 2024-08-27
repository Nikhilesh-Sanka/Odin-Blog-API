const { Router } = require("express");
const queries = require("../queries.js");

const router = Router();

//Fetching all posts//
router.get("/posts", async (req, res) => {
  let userId = req.user.id;
  let posts = await queries.getPostsOfUsers(userId);
  req.sendStatus(200).json(posts);
});

//Fetching individual posts//
router.get("/posts/:postId", async (req, res) => {
  let postId = req.params["postId"];
  let post = await queries.getPost(postId);
  res.sendStatus(200).json(post);
});

//Creating post//
router.post("/posts", async (req, res) => {
  const userId = req.user.id;
  const categories = [];
  for (let field in req.body) {
    if (/checkbox-[0-9]*/.test(field)) {
      categories.push(req.body[field]);
    }
  }
  const content = req.body["content"];
  const title = req.body["title"];
  const publishStatus = req.body["publish-status"] === "true" ? true : false;
  await queries.addPost(userId, title, content, categories, publishStatus);
  req.sendStatus(201);
});

//Editing the posts//
router.put("/posts/postId", async (req, res) => {
  let postId = req.params["postId"];
  let updatedPublishedStatus =
    req.body["publish-status"] === "true" ? true : false;
  let userId = req.user.id;
  let updatedContent = req.body["content"];
  let updatedTitle = req.body["title"];
  let updatedCategories = [];
  for (let field in req.body) {
    if (/checkbox-[0-9]*/.test(field)) {
      updatedCategories.push(req.body[field]);
    }
  }
  await queries.editPost(
    userId,
    updatedTitle,
    updatedContent,
    updatedCategories,
    updatedPublishedStatus,
    postId
  );
});

//Deleting the posts//
router.delete("/posts/:postId", async (req, res) => {
  const postId = req.params["postId"];
  await queries.deletePost(postId);
  res.sendStatus(200);
});

//Deleting the comments//
router.delete("/comments/:commentId", async (req, res) => {
  const commentId = req.params["commentId"];
  await queries.deleteComment(commentId);
  res.sendStatus(200);
});

module.exports = router;
