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
        url: 'https://media.istockphoto.com/id/1346125184/photo/group-of-successful-multiethnic-business-team.jpg?s=1024x1024&w=is&k=20&c=yeaDtJU-h3TKfS8FbmUVaq946eWSk3vCN2BLrr0YPFo=', 
        preview: true
      }, 
      {
        groupId: 3, 
        url: 'https://media.istockphoto.com/id/863497498/photo/i-need-everyone-to-give-me-their-best-ideas.jpg?s=1024x1024&w=is&k=20&c=02iF82o51IpGwNRXyhMjOh0GR9aAE1cMlp6qr5y8r40=',
        preview: true
      }, 
      {
        groupId: 4, 
        url: 'https://media.istockphoto.com/id/1287395025/photo/woman-speaking-at-support-group-meeting-for-mental-health-or-dependency-issues-in-community.jpg?s=1024x1024&w=is&k=20&c=gSBrVARsuXm0w2n6lZLPWprTkIsT3pglX_c1lnSYwbE=', 
        preview: true 
      }, 
      {
        groupId: 5, 
        url: 'https://media.istockphoto.com/id/1308419138/photo/happy-multi-generational-women-having-fun-together-multiracial-friends-smiling-on-camera.jpg?s=1024x1024&w=is&k=20&c=fXxB3L3_Z2nr65n30gkltHzXWYVTxmvoDCjYVka0m5k=', 
        preview: true
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