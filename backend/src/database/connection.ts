import { Sequelize } from "sequelize";
import 'dotenv/config';
import { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_USERNAME } from "../utils/vars";

export const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
  host: DATABASE_HOST,
  dialect: "mysql"
});