const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const ChatHistory = sequelize.define('ChatHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    sender: {
        type: DataTypes.ENUM('user', 'bot'),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: 'chat_history',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = ChatHistory;
