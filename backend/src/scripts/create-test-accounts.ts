import bcrypt from 'bcryptjs';
import { User, AuthorizedStudent } from '../models';
import { sequelize } from '../config/database';

const createTestAccounts = async () => {
  try {
    console.log('开始创建测试账号...');
    
    // 测试学生数据
    const testStudents = [
      { username: 'student1', password: '123456', name: '张三', className: '2024 级计算机 1 班', email: 'zhangsan@test.com' },
      { username: 'student2', password: '123456', name: '李四', className: '2024 级计算机 1 班', email: 'lisi@test.com' },
      { username: 'student3', password: '123456', name: '王五', className: '2024 级软件工程 2 班', email: 'wangwu@test.com' },
      { username: 'student4', password: '123456', name: '赵六', className: '2024 级软件工程 2 班', email: 'zhaoliu@test.com' },
      { username: 'student5', password: '123456', name: '钱七', className: '2024 级网络工程 1 班', email: 'qianqi@test.com' },
    ];

    for (const student of testStudents) {
      // 检查是否已存在
      const existing = await User.findOne({ where: { username: student.username } });
      if (existing) {
        console.log(`账号 ${student.username} 已存在，跳过`);
        continue;
      }

      // 创建授权学生记录
      const authorized = await AuthorizedStudent.create({
        name: student.name,
        className: student.className,
        isUsed: false,
      });

      // 加密密码
      const hashedPassword = await bcrypt.hash(student.password, 10);

      // 创建用户
      const user = await User.create({
        username: student.username,
        password: hashedPassword,
        name: student.name,
        className: student.className,
        email: student.email,
        role: 'student',
      });

      // 标记授权学生为已使用
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
  } catch (error) {
    console.error('创建测试账号失败:', error);
    process.exit(1);
  }
};

createTestAccounts();
