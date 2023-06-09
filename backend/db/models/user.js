'use strict';
const { Model, Validator } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Event, {
        foreignKey: 'userId', 
        otherKey: 'eventId', 
        through: models.Attendance, 
        onDelete: 'cascade'
      }); 

      User.hasMany(models.Group, {
        foreignKey: 'organizerId'
      }); 

      User.hasMany(models.Membership, {
        foreignKey: 'userId'
      }) 

      User.hasMany(models.Attendance, {
        foreignKey: 'userId', 
        onDelete: 'cascade'
      })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        len: [4, 30], 
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.");
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        len: [3, 256], 
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY, 
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    },
    firstName: {
      type: DataTypes.STRING, 
      validate: {
        len: [0, 256]
      }
    }, 
    lastName: {
      type: DataTypes.STRING, 
      validate: {
        len: [0, 256]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
      }
    }
  });
  return User;
};