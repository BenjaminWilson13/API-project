'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Memberships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER, 
        references: {
          model: 'Users', 
          key: 'id'
        }
      },
      groupId: {
        type: Sequelize.INTEGER, 
        references: {
          model: 'Groups', 
          key: 'id'
        }
      },
      status: {
        type: Sequelize.ENUM('co-host', 'member', 'pending', 'organizer')
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
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Memberships";
    return queryInterface.dropTable(options);
  }
};