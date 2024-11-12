'use strict';
import {
  Model
} from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Messages.init({
    type: {
      type: DataTypes.ENUM('user', 'assistant'),
      allowNull: false
    },
    content: {
      type:DataTypes.STRING,
      allowNull: false
    },
    chat_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Messages',
  });

  Messages.associate = (models) => {
    Messages.belongsTo(models.Chats, {
      foreignKey: 'chat_id'
    })
  }

  return Messages;
};