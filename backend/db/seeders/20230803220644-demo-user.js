'use strict';
const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        firstName: "name1",
        lastName: "last1",
        username: 'Demo-lition',
        // firstName: 'test1',
        // lastName: 'test2',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user1@user.io',
        firstName: "name2",
        lastName: "last2",
        username: 'FakeUser1',
        // firstName: 'test4',
        // lastName: 'test5',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user2@user.io',
        firstName: "name",
        lastName: "last",
        username: 'FakeUser2',
        // firstName: 'test6',
        // lastName: 'test7',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'demo@demo.com',
        firstName: "Demo",
        lastName: "User",
        username: 'Demouser',
        // firstName: 'Demo',
        // lastName: 'User',
        hashedPassword: bcrypt.hashSync('secretpassword')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
// redone database
