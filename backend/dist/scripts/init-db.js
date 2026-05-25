"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_2 = require("../models");
const initDatabase = async () => {
    try {
        console.log('开始初始化数据库...');
        await (0, models_1.testConnection)();
        await (0, models_1.syncDatabase)();
        const adminExists = await models_2.User.findOne({ where: { username: 'admin' } });
        if (!adminExists) {
            const hashedPassword = await bcryptjs_1.default.hash('admin123', 10);
            await models_2.User.create({
                username: 'admin',
                password: hashedPassword,
                name: '系统管理员',
                role: 'teacher',
            });
            console.log('✓ 已创建默认管理员账号：admin / admin123');
        }
        else {
            console.log('✓ 管理员账号已存在');
        }
        console.log('数据库初始化完成!');
        process.exit(0);
    }
    catch (error) {
        console.error('数据库初始化失败:', error);
        process.exit(1);
    }
};
initDatabase();
//# sourceMappingURL=init-db.js.map