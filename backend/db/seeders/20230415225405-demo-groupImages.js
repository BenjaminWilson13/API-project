'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1, 
        url: 'http://some.images.com', 
        preview: true
      }, 
      {
        groupId: 2, 
        url: 'http://some.images.com', 
        preview: true
      }, 
      {
        groupId: 3, 
        url: 'http://some.images.com', 
        preview: false
      }, 
      {
        groupId: 4, 
        url: 'http://some.images.com', 
        preview: true 
      }, 
      {
        groupId: 5, 
        url: 'http://some.images.com', 
        preview: false
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};