import { sequelize } from "../db/connection";
import Alert from "./Alert";
import Device from "./Device";
import User from "./User";
import 'dotenv/config'

User.hasMany(Alert, { foreignKey: 'user_id' });
User.hasMany(Device, { foreignKey: 'user_id' });
Alert.belongsTo(User, { foreignKey: 'user_id' });
Device.belongsTo(User, { foreignKey: 'user_id' });

export async function syncModels() {
  try {
    await sequelize.authenticate();
    console.log('Conexão estabelecida com sucesso.');

     await sequelize.sync({ force: false, logging: console.log });

    console.log('Modelos sincronizados com sucesso.');
  } catch (error) {
    console.error('Erro ao sincronizar modelos:', error);
  }
}