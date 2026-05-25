"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Application extends sequelize_1.Model {
}
exports.Application = Application;
Application.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    company: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
    },
    position: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
    },
    applicationDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    channel: {
        type: sequelize_1.DataTypes.ENUM('Boss 直聘', '实习僧', '公司官网', '内推', '智联招聘', '牛客网', '其他'),
        allowNull: true,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('实习', '秋招正式批'),
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('已投递/未处理', '简历筛选', '笔试/测评', '面试中', 'OC', 'Offer', '已拒', '已结束'),
        defaultValue: '已投递/未处理',
    },
    statusDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    location: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    referralCode: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    priority: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 5,
        },
    },
    remarks: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: database_1.default,
    tableName: 'applications',
    underscored: true,
});
exports.default = Application;
//# sourceMappingURL=Application.js.map