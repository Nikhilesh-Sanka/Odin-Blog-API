const { Router } = require("express");
const queries = require("../queries.js");

const router = Router();

// Fetching All Posts //
router.get("/posts", async (req, res, next) => {
  try {
    let allPublishedPosts = await queries.getAllPublishedPosts();
    res.json(allPublishedPosts);
  } catch (err) {
    next(err);
  }
});

//Fetching Posts For Viewing//
router.get("/posts/:postId", async (req, res, next) => {
  try {
    let postId = req.params["postId"];
    let post = await queries.getPost(postId);
    res.json(post);
  } catch (err) {
    next(err);
  }
});

//Fetching Categories For Viewing//
router.get("/categories", async (req, res) => {
  const categories = await queries.getAllCategories();
  res.json(categories);
});

// Adding comments //
router.post("/posts/:postId/comments", async (req, res) => {
  const author = req.body["author"];
  const comment = req.body["comment"];
  const postId = req.params["postId"];
  await queries.addComment(postId, author, comment);
  res.sendStatus(201);
});

module.exports = router;
