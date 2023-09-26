'use strict';

const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123
      },
      {
        ownerId: 2,
        address: "Big lane 124",
        city: "Houston",
        state: "Texas",
        country: "United States of America",
        lat: 76.7645358,
        lng: -188.4730327,
        name: "Big House",
        description: "Come to the bighouse",
        price: 123
      },
      {
        ownerId: 2,
        address: "Larger street 345",
        city: "San Antonio",
        state: "Texas",
        country: "United States of America",
        lat: 79,
        lng: 100,
        name: "Mega Apartment",
        description: "Most spacious apartment ever",
        price: 220
      },
      {
        ownerId: 3,
        address: "Parakeet roadway 740",
        city: "San Antonio",
        state: "Texas",
        country: "United States of America",
        lat: 80,
        lng: 108,
        name: "The cafe",
        description: "Most tasty coffee",
        price: 350
      },
      {
        ownerId: 3,
        address: "Highway avenue 550",
        city: "Corpus Christi",
        state: "Texas",
        country: "United States of America",
        lat: 82,
        lng: 94,
        name: "Rested Home",
        description: "Most spacious apartment ever",
        price: 400
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['App Academy', "Big House", "Mega Apartment", "The cafe", "Rested Home"] }
    }, {});
  }
};
