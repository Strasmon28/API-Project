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
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  check('username')
    .exists({ checkFalsy: true })
    .notEmpty()
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
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
      // accounts.forEach(account => {
      //   if(email === account.email){
      //     res.status(500);
      //     // res.json({
      //     //   message:
      //     // })
      //   }
      //   if(username === account.username){
      //     res.status(500);

      //   }
      // })

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
