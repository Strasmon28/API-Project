'use strict';

const { DataTypes, QueryTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Users', 'firstName',
      {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
      }
    );
    await queryInterface.addColumn('Users', 'lastName',
    {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    }
  );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('User', 'firstName');
    await queryInterface.removeColumn('User', 'lastName');
  }
};
