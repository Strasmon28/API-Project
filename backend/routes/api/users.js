// backend/routes/api/users.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  check('firstName')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("First Name is required"),
  check('lastName')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Last Name is required"),
  check('password')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;
      const hashedPassword = bcrypt.hashSync(password);

      //Use findAll where: ?
      //Check if there are matching usernames or emails in the database
      // const accounts = User.findAll();
      //Iterate through each account
      const emailCheck = await User.findOne({
        where: { email: email }
      })

      //If matching email was found, send an error
      if (emailCheck){
        res.status(500)
        res.json({
            message: "User already exists",
            errors: {
              email: "User with that email already exists"
            }
        })
      }

      const userCheck = await User.findOne({
        where: { username: username }
      })

      if (userCheck) {
        res.status(500)
        res.json({
          message: "User already exists",
            errors: {
              email: "User with that username already exists"
            }
        })
      }

      const user = await User.create({ email, username, hashedPassword, firstName, lastName });

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
);

module.exports = router;
