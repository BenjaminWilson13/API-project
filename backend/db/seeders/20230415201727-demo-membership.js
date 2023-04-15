'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Memberships';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        groupId: 1,
        status: 'organizer'
      },
      {
        userId: 1,
        groupId: 2,
        status: 'co-host'
      },
      {
        userId: 1,
        groupId: 3,
        status: 'member'
      },
      {
        userId: 1,
        groupId: 4,
        status: 'pending'
      },
      {
        userId: 2,
        groupId: 2,
        status: 'organizer'
      },
      {
        userId: 2,
        groupId: 3,
        status: 'co-host'
      },
      {
        userId: 2, 
        groupId: 4, 
        status: 'member'
      }, 
      {
        userId: 2, 
        groupId: 5, 
        status: 'pending', 
      }, 
      {
        userId: 3, 
        groupId: 3, 
        status: 'organizer'
      }, 
      {
        userId: 3, 
        groupId: 4, 
        status: 'co-host'
      }, 
      {
        userId: 3, 
        groupId: 5, 
        status: 'member'
      }, 
      {
        userId: 3, 
        groupId: 1, 
        status: 'pending'
      }, 
      {
        userId: 4, 
        groupId: 4, 
        status: 'organizer'
      }, 
      {
        userId: 4, 
        groupId: 5, 
        status: 'co-host'
      }, 
      {
        userId: 4, 
        groupId: 1, 
        status: 'member'
      }, 
      {
        userId: 4, 
        groupId: 2, 
        status: 'pending'
      }, 
      {
        userId: 5, 
        groupId: 5, 
        status: 'organizer'
      }, 
      {
        userId: 5, 
        groupId: 1, 
        status: 'co-host'
      }, 
      {
        userId: 5, 
        groupId: 2, 
        status: 'member'
      }, 
      {
        userId: 5, 
        groupId: 3, 
        status: 'pending'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};