'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Attendances';
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1, 
        userId: 1, 
        status: 'attending'
      }, 
      {
        eventId: 2, 
        userId: 2, 
        status: 'attending'
      }, 
      {
        eventId: 3, 
        userId: 3, 
        status: 'attending'
      }, 
      {
        eventId: 4, 
        userId: 4, 
        status: 'attending'
      }, 
      {
        eventId: 5, 
        userId: 5, 
        status: 'attending'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};