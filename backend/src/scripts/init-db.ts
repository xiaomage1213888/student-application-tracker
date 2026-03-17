import { testConnection, syncDatabase } from '../models';
import bcrypt from 'bcryptjs';
import { User } from '../models';

const initDatabase = async () => {
  try {
    console.log('开始初始化数据库...');
    
    await testConnection();
    await syncDatabase();

    // 创建默认管理员账号
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        name: '系统管理员',
        role: 'teacher',
      });
      console.log('✓ 已创建默认管理员账号：admin / admin123');
    } else {
      console.log('✓ 管理员账号已存在');
    }

    console.log('数据库初始化完成!');
    process.exit(0);
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
};

initDatabase();
