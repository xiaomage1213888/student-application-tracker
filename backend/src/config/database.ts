import { Sequelize } from 'sequelize';
import config from '../config';

const initializeDatabase = (): Sequelize => {
  let sequelize: Sequelize;

  if (config.database.dialect === 'sqlite') {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: config.database.storage,
      logging: config.nodeEnv === 'development' ? console.log : false,
    });
  } else {
    sequelize = new Sequelize({
      dialect: 'mysql',
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      username: config.database.user,
      password: config.database.password,
      logging: config.nodeEnv === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
  }

  return sequelize;
};

export const sequelize = initializeDatabase();

// 测试数据库连接
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功!');
  } catch (error) {
    console.error('无法连接数据库:', error);
    throw error;
  }
};

export default sequelize;
