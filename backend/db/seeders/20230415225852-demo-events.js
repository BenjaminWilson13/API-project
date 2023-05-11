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
        startDate: '2024-11-19 20:00:00', 
        endDate: '2024-11-19 22:00:00'
      }, 
      {
        venueId: 2, 
        groupId: 2, 
        name: 'Event2', 
        description: 'Demo Event 2', 
        type: 'Online', 
        capacity: 50, 
        price: 0, 
        startDate: '2024-11-19 20:00:00', 
        endDate: '2024-11-19 22:00:00'
      }, 
      {
        venueId: 3, 
        groupId: 3, 
        name: 'Event3', 
        description: 'Demo Event 3', 
        type: 'In person', 
        capacity: 100, 
        price: 560, 
        startDate: '2024-11-19 20:00:00', 
        endDate: '2024-11-19 22:00:00'
      }, 
      {
        venueId: 4, 
        groupId: 4,
        name: 'Event4', 
        description: 'Demo Event 4', 
        type: 'Online', 
        capacity: 10, 
        price: 1, 
        startDate: '2024-11-19 20:00:00', 
        endDate: '2024-11-19 22:00:00'
      }, 
      {
        venueId: 5, 
        groupId: 5, 
        name: 'Event5', 
        description: 'Demo Event 5', 
        type: 'In person', 
        capacity: 15, 
        price: 50, 
        startDate: '2024-11-19 20:00:00', 
        endDate: '2024-11-19 22:00:00'
      }, 
      {
        venueId: 1, 
        groupId: 1, 
        name: "Past Event Number 1", 
        description: "This is an event in the 'past event's series'. These events are designed to show up in the 'past events' field on the group detail page",
        type: "In person", 
        capacity: 99, 
        price: 1, 
        startDate: '2022-1-1 20:00:00', 
        endDate: '2022-1-1 20:00:00'
      }, 
      {
        venueId: 2, 
        groupId: 2, 
        name: "Past Event Number 2", 
        description: "This is an event in the 'past event's series'. These events are designed to show up in the 'past events' field on the group detail page",
        type: "In person", 
        capacity: 99, 
        price: 2.50, 
        startDate: '2022-1-1 20:00:00', 
        endDate: '2022-1-1 20:00:00'
      }, 
      {
        venueId: 3, 
        groupId: 3, 
        name: "Past Event Number 3", 
        description: "This is an event in the 'past event's series'. These events are designed to show up in the 'past events' field on the group detail page",
        type: "In person", 
        capacity: 99, 
        price: 3.99, 
        startDate: '2022-1-1 20:00:00', 
        endDate: '2022-1-1 20:00:00'
      }, 
      {
        venueId: 4, 
        groupId: 4, 
        name: "Past Event Number 4", 
        description: "This is an event in the 'past event's series'. These events are designed to show up in the 'past events' field on the group detail page",
        type: "In person", 
        capacity: 99, 
        price: 4.25, 
        startDate: '2022-1-1 20:00:00', 
        endDate: '2022-1-1 20:00:00'
      }, 
      {
        venueId: 5, 
        groupId: 5, 
        name: "Past Event Number 5", 
        description: "This is an event in the 'past event's series'. These events are designed to show up in the 'past events' field on the group detail page",
        type: "In person", 
        capacity: 99, 
        price: 5.55, 
        startDate: '2022-1-1 20:00:00', 
        endDate: '2022-1-1 20:00:00'
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