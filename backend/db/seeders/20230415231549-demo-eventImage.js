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
        url: 'https://media.istockphoto.com/id/1133692578/photo/exhibition-event-hall-blur-background-of-trade-show-business-world-or-international-expo.jpg?s=1024x1024&w=is&k=20&c=BTzdhNbNQ_53-lYUlLK3wmhk4z3qY-QQVFSMmTfFjHw=', 
        preview: true
      }, 
      {
        eventId: 2, 
        url: 'https://media.istockphoto.com/id/887680492/photo/visitors-among-the-stands-of-companies.jpg?s=1024x1024&w=is&k=20&c=bIF2K-K26o6ZHP4-XmRQ762Lm-OLBkTT6g_E8aEJutQ=', 
        preview: true
      }, 
      {
        eventId: 3, 
        url: 'https://media.istockphoto.com/id/1059441412/photo/abstract-blurred-event-exhibition-with-people-background-business-convention-show-concept.jpg?s=1024x1024&w=is&k=20&c=1Nm9X5MCNPHbE574VW0UdLX_0Q6BRJQnabRXdDJykZU=', 
        preview: true
      }, 
      {
        eventId: 4, 
        url: 'https://media.istockphoto.com/id/857615704/photo/blurred-defocused-background-of-public-event-exhibition-hall-business-trade-show-or-commercial.jpg?s=1024x1024&w=is&k=20&c=oyDAB32xPHUoZddiBFkaS3DgKJc72SbLEyGpDNpooOc=', 
        preview: true 
      }, 
      {
        eventId: 5, 
        url: 'https://media.istockphoto.com/id/974238866/photo/audience-listens-to-the-lecturer-at-the-conference.jpg?s=1024x1024&w=is&k=20&c=sjFBTcDef2OTSABvMxQucaOXeqr6hz3Qvqp084Lxj2Q=', 
        preview: true
      }, 
      {
        eventId: 6, 
        url: 'https://contenthub-static.grammarly.com/blog/wp-content/uploads/2023/03/Simple-Past-Tense.png', 
        preview: true
      }, 
      {
        eventId: 7, 
        url: 'https://contenthub-static.grammarly.com/blog/wp-content/uploads/2023/03/Simple-Past-Tense.png', 
        preview: true
      }, 
      {
        eventId: 8, 
        url: 'https://contenthub-static.grammarly.com/blog/wp-content/uploads/2023/03/Simple-Past-Tense.png', 
        preview: true
      }, 
      {
        eventId: 9, 
        url: 'https://contenthub-static.grammarly.com/blog/wp-content/uploads/2023/03/Simple-Past-Tense.png', 
        preview: true
      }, 
      {
        eventId: 10, 
        url: 'https://contenthub-static.grammarly.com/blog/wp-content/uploads/2023/03/Simple-Past-Tense.png', 
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