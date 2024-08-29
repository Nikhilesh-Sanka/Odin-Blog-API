const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const prisma = new PrismaClient();

const router = Router();

router.get("/", async (req, res) => {
  const username = req.query["username"].toLowerCase();
  const password = req.query["password"];
  const result = await prisma.user.findFirst({
    where: {
      name: username,
    },
  });
  if (result == null) {
    res.sendStatus(403);
  } else if (result.password === password) {
    let rawToken = jwt.sign(
      { id: result.id, name: result.name },
      process.env.TOKEN_SECRET
    );
    let processedToken = `Bearer ${rawToken}`;
    res.json({ token: processedToken });
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
