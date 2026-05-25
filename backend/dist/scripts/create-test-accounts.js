"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../models");
const createTestAccounts = async () => {
    try {
        console.log('开始创建测试账号...');
        const testStudents = [
            { username: 'student1', password: '123456', name: '张三', className: '2024 级计算机 1 班', email: 'zhangsan@test.com' },
            { username: 'student2', password: '123456', name: '李四', className: '2024 级计算机 1 班', email: 'lisi@test.com' },
            { username: 'student3', password: '123456', name: '王五', className: '2024 级软件工程 2 班', email: 'wangwu@test.com' },
            { username: 'student4', password: '123456', name: '赵六', className: '2024 级软件工程 2 班', email: 'zhaoliu@test.com' },
            { username: 'student5', password: '123456', name: '钱七', className: '2024 级网络工程 1 班', email: 'qianqi@test.com' },
        ];
        for (const student of testStudents) {
            const existing = await models_1.User.findOne({ where: { username: student.username } });
            if (existing) {
                console.log(`账号 ${student.username} 已存在，跳过`);
                continue;
            }
            const authorized = await models_1.AuthorizedStudent.create({
                name: student.name,
                className: student.className,
                isUsed: false,
            });
            const hashedPassword = await bcryptjs_1.default.hash(student.password, 10);
            const user = await models_1.User.create({
                username: student.username,
                password: hashedPassword,
                name: student.name,
                className: student.className,
                email: student.email,
                role: 'student',
            });
            await authorized.update({
                isUsed: true,
                usedByUserId: user.id,
            });
            console.log(`✓ 创建成功：${student.username} (${student.name} - ${student.className})`);
        }
        console.log('\n测试账号创建完成！');
        console.log('\n=== 测试账号列表 ===');
        console.log('账号：student1  密码：123456  姓名：张三  班级：2024 级计算机 1 班');
        console.log('账号：student2  密码：123456  姓名：李四  班级：2024 级计算机 1 班');
        console.log('账号：student3  密码：123456  姓名：王五  班级：2024 级软件工程 2 班');
        console.log('账号：student4  密码：123456  姓名：赵六  班级：2024 级软件工程 2 班');
        console.log('账号：student5  密码：123456  姓名：钱七  班级：2024 级网络工程 1 班');
        console.log('====================\n');
        process.exit(0);
    }
    catch (error) {
        console.error('创建测试账号失败:', error);
        process.exit(1);
    }
};
createTestAccounts();
//# sourceMappingURL=create-test-accounts.js.map