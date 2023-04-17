'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        venueId: 1, 
        groupId: 1, 
        name: 'Event1', 
        description: 'Demo Event 1', 
        type: 'In person', 
        capacity: 999, 
        price: 15, 
        startDate: '11-11-22', 
        endDate: '11-11-22'
      }, 
      {
        venueId: 2, 
        groupId: 2, 
        name: 'Event2', 
        description: 'Demo Event 2', 
        type: 'Online', 
        capacity: 50, 
        price: 0, 
        startDate: '11-11-22', 
        endDate: '11-11-22'
      }, 
      {
        venueId: 3, 
        groupId: 3, 
        name: 'Event3', 
        description: 'Demo Event 3', 
        type: 'In person', 
        capacity: 100, 
        price: 560, 
        startDate: '11-11-22', 
        endDate: '11-11-22'
      }, 
      {
        venueId: 4, 
        groupId: 4,
        name: 'Event4', 
        description: 'Demo Event 4', 
        type: 'Online', 
        capacity: 10, 
        price: 1, 
        startDate: '11-11-22', 
        endDate: '11-11-22'
      }, 
      {
        venueId: 5, 
        groupId: 5, 
        name: 'Event5', 
        description: 'Demo Event 5', 
        type: 'In person', 
        capacity: 15, 
        price: 50, 
        startDate: '11-11-22', 
        endDate: '11-11-22'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      venueId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};