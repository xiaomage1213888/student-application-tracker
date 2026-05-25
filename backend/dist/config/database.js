"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config"));
const initializeDatabase = () => {
    let sequelize;
    if (config_1.default.database.dialect === 'sqlite') {
        sequelize = new sequelize_1.Sequelize({
            dialect: 'sqlite',
            storage: config_1.default.database.storage,
            logging: config_1.default.nodeEnv === 'development' ? console.log : false,
        });
    }
    else {
        sequelize = new sequelize_1.Sequelize({
            dialect: 'mysql',
            host: config_1.default.database.host,
            port: config_1.default.database.port,
            database: config_1.default.database.name,
            username: config_1.default.database.user,
            password: config_1.default.database.password,
            logging: config_1.default.nodeEnv === 'development' ? console.log : false,
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
exports.sequelize = initializeDatabase();
const testConnection = async () => {
    try {
        await exports.sequelize.authenticate();
        console.log('数据库连接成功!');
    }
    catch (error) {
        console.error('无法连接数据库:', error);
        throw error;
    }
};
exports.testConnection = testConnection;
exports.default = exports.sequelize;
//# sourceMappingURL=database.js.map