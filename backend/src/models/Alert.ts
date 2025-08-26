import { DataTypes } from "sequelize";
import { sequelize } from "../db/connection";

const Alert = sequelize.define(
    'Alert',
    {
        id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        device_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'devices',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    },
    {
        tableName: 'alerts'
    }
);

export default Alert;