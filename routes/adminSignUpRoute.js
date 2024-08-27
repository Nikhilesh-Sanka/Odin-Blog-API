const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const queries = require("../queries.js");

require("dotenv").config();

const prisma = new PrismaClient();

const router = Router();

const validateInputs = [
  body("username").trim().notEmpty().withMessage("Username cannot be empty"),
  body("username").custom(async (value) => {
    const processedUsername = value.toLowerCase();
    const result = await prisma.user.findMany({
      where: {
        name: processedUsername,
      },
    });
    if (result.length === 0) return true;
    throw new Error("username already exists");
  }),
  body("admin-code").custom(async (value) => {
    if (value === process.env.ADMIN_CODE) return true;
    throw new Error("authorization code is invalid");
  }),
];

router.post("/", validateInputs, async (req, res) => {
  const errors = validationResult(req).errors;
  if (errors.length === 0) {
    await queries.addUser(req.body["username"], req.body["password"]);
    res.sendStatus(201);
  } else {
    res.sendStatus(400).json(errors);
  }
});

module.exports = router;
