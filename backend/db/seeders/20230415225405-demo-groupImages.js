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
        url: 'https://media.istockphoto.com/id/1147751536/photo/portrait-of-young-friends-outdoors-posing-on-gangway-together.jpg?s=1024x1024&w=is&k=20&c=pUJc5ylqelYxUO1ym3AJLqu2H9w4f8Q6bJDRcVg1tjQ=', 
        preview: true
      }, 
      {
        groupId: 2, 
        url: 'https://media.istockphoto.com/id/1147751536/photo/portrait-of-young-friends-outdoors-posing-on-gangway-together.jpg?s=1024x1024&w=is&k=20&c=pUJc5ylqelYxUO1ym3AJLqu2H9w4f8Q6bJDRcVg1tjQ=', 
        preview: true
      }, 
      {
        groupId: 3, 
        url: 'https://media.istockphoto.com/id/1147751536/photo/portrait-of-young-friends-outdoors-posing-on-gangway-together.jpg?s=1024x1024&w=is&k=20&c=pUJc5ylqelYxUO1ym3AJLqu2H9w4f8Q6bJDRcVg1tjQ=', 
        preview: false
      }, 
      {
        groupId: 4, 
        url: 'https://media.istockphoto.com/id/1147751536/photo/portrait-of-young-friends-outdoors-posing-on-gangway-together.jpg?s=1024x1024&w=is&k=20&c=pUJc5ylqelYxUO1ym3AJLqu2H9w4f8Q6bJDRcVg1tjQ=', 
        preview: true 
      }, 
      {
        groupId: 5, 
        url: 'https://media.istockphoto.com/id/1147751536/photo/portrait-of-young-friends-outdoors-posing-on-gangway-together.jpg?s=1024x1024&w=is&k=20&c=pUJc5ylqelYxUO1ym3AJLqu2H9w4f8Q6bJDRcVg1tjQ=', 
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