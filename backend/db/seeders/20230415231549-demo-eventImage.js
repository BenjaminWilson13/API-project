'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1, 
        url: 'http://some.image.com', 
        preview: true
      }, 
      {
        eventId: 2, 
        url: 'http://some.image.com', 
        preview: false
      }, 
      {
        eventId: 3, 
        url: 'http://some.image.com', 
        preview: true
      }, 
      {
        eventId: 4, 
        url: 'http://some.image.com', 
        preview: false 
      }, 
      {
        eventId: 5, 
        url: 'http://some.image.com', 
        preview: true
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};