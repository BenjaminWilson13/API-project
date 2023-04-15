'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Attendances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eventId: {
        type: Sequelize.INTEGER, 
        references: {
          model: 'Events', 
          key: 'id'
        }, 
        onDelete: 'cascade'
      },
      userId: {
        type: Sequelize.INTEGER, 
        references: {
          model: 'Users', 
          key: 'id'
        }, 
        onDelete: 'cascade' 
      },
      status: {
        type: Sequelize.ENUM('pending', 'attending', 'waitlist')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Attendances');
  }
};