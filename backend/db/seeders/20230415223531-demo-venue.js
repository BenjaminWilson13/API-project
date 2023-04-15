'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1, 
        address: '1234 demo ave', 
        city: 'demoCity1', 
        state: 'demoState1', 
        lat: 75.9898, 
        lng: 80.8080
      }, 
      {
        groupId: 1, 
        address: '5678 demo st', 
        city: 'demoCity1', 
        state: 'demoState1', 
        lat: 60.6060, 
        lng: 70.7070
      }, 
      {
        groupId: 2, 
        address: '9101 demo pkwy', 
        city: 'demoCity2', 
        state: 'demoState2', 
        lat: 90.9090, 
        lng: 120.120120
      }, 
      {
        groupId: 2, 
        address: '11213 demo pl', 
        city: 'demoCity2', 
        state: 'demoState2', 
        lat: 10.1010, 
        lng: 20.2020
      }, 
      {
        groupId: 3, 
        address: '1234 Conspiracy St', 
        city: 'Arlington', 
        state: 'Texas', 
        lat: 50.5050, 
        lng: 30.3030
      }, 
      {
        groupId: 3, 
        address: '5678 Conspiracy Ave', 
        city: 'Arlington', 
        state: 'Texas', 
        lat: 69.420, 
        lng: 13.1313
      }, 
      {
        groupId: 4, 
        address: '1234 Rainy St', 
        city: 'Arlington', 
        state: 'Texas', 
        lat: 78.7878, 
        lng: 87.8787
      }, 
      {
        groupId: 4, 
        address: '5678 Rainy St', 
        city: 'Arlington', 
        state: 'Texas', 
        lat: 45.4545, 
        lng: 54.5454
      }, 
      {
        groupId: 5, 
        address: '1234 Main Rd', 
        city: 'Arlington', 
        state: 'Texas', 
        lat: 28.2828, 
        lng: 69.6969
      }, 
      {
        groupId: 5, 
        address: '5678 Main St', 
        city: 'Arlington', 
        state: 'Texas', 
        lat: 80.8080, 
        lng: 56.5656
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};