import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/connection";

interface UserAttributes {
  id: number;
  name: string;
  picture: string;
  email: string;
  emergency_number?: number[] | null;
  role?: string;
  password: string;
}

type UserCreationAttributes = Optional<UserAttributes, "id">;


class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
    public id!: number;
    public name!: string;
    public picture!: string;
    public email!: string;
    public emergency_number?: number[] | null;
    public role!: string;
    public password!: string;
  }

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
    emergency_number: {
      type: DataTypes.JSON, // pode ser JSON
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);

export default User;
