import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/connection";

interface UserAttributes {
  id: number;
  name: string;
  picture: string;
  email: string;
  emergency_number?: string[];
  password: string;
}

type UserCreationAttributes = Optional<UserAttributes, "id">;


class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
    public id!: number;
    public name!: string;
    public picture!: string;
    public email!: string;
    public emergency_number?: string[];
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
    emergency_number: {
      type: DataTypes.JSON, // pode ser JSON
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);

export default User;
