import sequelize, { testConnection } from '../config/database';
import User from './User';
import AuthorizedStudent from './AuthorizedStudent';
import Application from './Application';

// 定义关联关系
User.hasMany(Application, {
  foreignKey: 'userId',
  as: 'applications',
  onDelete: 'CASCADE',
});

Application.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// 老师可以管理多个班级的学生
User.hasMany(AuthorizedStudent, {
  foreignKey: 'usedByUserId',
  as: 'managedStudents',
});

AuthorizedStudent.belongsTo(User, {
  foreignKey: 'usedByUserId',
  as: 'manager',
});

// 同步数据库
export const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('数据库表同步成功!');
  } catch (error) {
    console.error('数据库表同步失败:', error);
    throw error;
  }
};

export { User, AuthorizedStudent, Application };
export { testConnection } from '../config/database';
export default sequelize;
