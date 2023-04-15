'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId: 1, 
        name: 'demoGroup1', 
        about: 'This is the first of the demo groups.', 
        type: 'In Person', 
        private: true, 
        city: 'demoCity1', 
        state: 'demoState1'
      }, 
      {
        organizerId: 2, 
        name: 'demoGroup2', 
        about: 'This is the second of the demo group.', 
        type: 'Online', 
        private: false, 
        city: 'demoCity2', 
        state: 'demoState2'
      }, 
      {
        organizerId: 3, 
        name: 'ConspiraciesRUS', 
        about: 'Conspiricy and Conspiracy accessories.', 
        type: 'In Person', 
        private: true, 
        city: 'Arlington', 
        state: 'Texas'
      }, 
      {
        organizerId: 4, 
        name: 'PropaneFans', 
        about: 'Learn about Propane', 
        type: 'In Person', 
        private: false, 
        city: 'Arlington', 
        state: 'Texas'
      }, 
      {
        organizerId: 5, 
        name: 'Arlington Comedy Club', 
        about: 'Great jokes for all!', 
        type: 'Online', 
        private: false, 
        city: 'Arlington', 
        state: 'Texas'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['demoGroup1', 'demoGroup2', 'ConspiraciesRUS', 'PropaneFans', 'Arlington Comedy Club'] }
    }, {});
  }
};