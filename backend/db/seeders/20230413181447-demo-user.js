'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'Jimmie', 
        lastName: 'Johnson',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Frankie', 
        lastName: 'Furter', 
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Dale', 
        lastName: 'Gribble', 
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      }, 
      {
        firstName: 'Hank', 
        lastName: 'Hill', 
        email: 'hank@koth.com', 
        username: 'ProPain1', 
        hashedPassword: bcrypt.hashSync('Propane1')
      }, 
      {
        firstName: 'Bobby', 
        lastName: 'Hill', 
        email: 'funnyMan@koth.com', 
        username: 'comedyBoy', 
        hashedPassword: bcrypt.hashSync('ComedyIsGreat')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'ProPain1', 'comedyBoy'] }
    }, {});
  }
};