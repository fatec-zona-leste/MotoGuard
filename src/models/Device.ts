import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection";

const Device = sequelize.define(
  'Device',
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
    bluetooth_name: {
      type: DataTypes.STRING,
      unique: true
    },
    service_uuid: {
      type: DataTypes.STRING,
    },
    characteristic_uuid: {
      type: DataTypes.STRING,
    },

    type: {
        type: DataTypes.ENUM('IMPACT_SENSOR', 'RIGHT_SENSOR', 'LEFT_SENSOR', 'REAR_SENSOR'),
        allowNull: false,
    },
  },
  {
    tableName: 'devices',
  }
);

export default Device;
