const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Prediction = sequelize.define('Prediction', {
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
    crop: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    region: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    yield_estimate: {
        type: DataTypes.DECIMAL(4, 1),
        allowNull: false
    },
    confidence: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    factors: {
        type: DataTypes.JSON,
        allowNull: true
    },
    recommendations: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    tableName: 'predictions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Prediction;
