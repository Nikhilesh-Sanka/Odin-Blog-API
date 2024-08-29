const { Router } = require("express");
const queries = require("../queries.js");

const router = Router();

//Fetching all posts//
router.get("/posts", async (req, res) => {
  let userId = req.user.id;
  let posts = await queries.getPostsOfUsers(userId);
  res.json(posts);
});

//Fetching individual posts//
router.get("/posts/:postId", async (req, res) => {
  let postId = req.params["postId"];
  let post = await queries.getPost(postId);
  res.json(post);
});

//Creating post//
router.post("/posts", async (req, res) => {
  console.log(req.body);
  const userId = req.user.id;
  const categories = req.body.categories;
  const content = req.body["content"];
  const title = req.body["title"];
  const publishStatus = req.body["publish-status"];
  await queries.addPost(userId, title, content, categories, publishStatus);
  res.sendStatus(201);
});

//Editing the posts//
router.put("/posts/:postId", async (req, res) => {
  let postId = req.params["postId"];
  let updatedPublishedStatus = req.body["publish-status"];
  let userId = req.user.id;
  let updatedContent = req.body["content"];
  let updatedTitle = req.body["title"];
  let updatedCategories = req.body.categories;
  console.log(req.body);
  await queries.editPost(
    userId,
    updatedTitle,
    updatedContent,
    updatedCategories,
    updatedPublishedStatus,
    postId
  );
  res.sendStatus(201);
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
