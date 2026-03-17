import { Op } from 'sequelize';
import { User, AuthorizedStudent, Application } from '../models';
import { sequelize } from '../config/database';

export class TeacherService {
  // 导入授权学生名单
  static async importAuthorizedStudents(
    students: Array<{ name: string; className: string }>,
    teacherId: number
  ) {
    const transaction = await sequelize.transaction();

    try {
      const results = [];
      
      for (const student of students) {
        const [record, created] = await AuthorizedStudent.findOrCreate({
          where: {
            name: student.name,
            className: student.className,
          },
          defaults: {
            isUsed: false,
          },
          transaction,
        });

        if (!created) {
          // 如果已存在，更新为未使用状态（允许重新导入）
          await record.update(
            { isUsed: false, usedByUserId: null },
            { transaction }
          );
        }

        results.push(record);
      }

      await transaction.commit();
      return results;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // 获取老师管理的所有学生
  static async getManagedStudents(teacherId: number, className?: string) {
    const where: any = {};
    
    if (className) {
      where.className = className;
    }

    const students = await AuthorizedStudent.findAll({
      where,
      include: [
        {
          model: User,
          as: 'manager',
          where: { id: teacherId },
          required: false,
        },
      ],
      order: [['className', 'ASC'], ['name', 'ASC']],
    });

    return students;
  }

  // 获取班级列表
  static async getClassNames(teacherId: number) {
    const students = await AuthorizedStudent.findAll({
      attributes: ['className'],
      group: ['className'],
      raw: true,
    });

    return students.map((s: any) => s.className).filter(Boolean);
  }

  // 获取某个班级的统计数据
  static async getClassStatistics(className: string, teacherId: number) {
    // 获取该班级的所有学生用户
    const studentUsers = await User.findAll({
      where: {
        className,
        role: 'student',
      },
      attributes: ['id', 'name', 'username'],
    });

    const studentIds = studentUsers.map((u) => u.id);

    // 获取投递记录
    const applications = await Application.findAll({
      where: {
        userId: {
          [Op.in]: studentIds,
        },
      },
    });

    const totalApplications = applications.length;
    const studentCount = studentUsers.length;
    const avgApplications = studentCount > 0 ? (totalApplications / studentCount).toFixed(2) : '0';

    // 状态分布
    const statusCount: Record<string, number> = {};
    applications.forEach((app) => {
      const status = app.status || '未设置';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    // 学生投递排名
    const studentRanks: Array<{
      studentId: number;
      studentName: string;
      count: number;
    }> = [];

    for (const student of studentUsers) {
      const count = await Application.count({
        where: { userId: student.id },
      });

      studentRanks.push({
        studentId: student.id,
        studentName: student.name,
        count,
      });
    }

    studentRanks.sort((a, b) => b.count - a.count);

    return {
      className,
      studentCount,
      totalApplications,
      avgApplications,
      statusCount,
      studentRanks,
    };
  }

  // 获取所有班级的汇总统计
  static async getOverallStatistics(teacherId: number) {
    const classNames = await this.getClassNames(teacherId);
    
    const overallStats = {
      totalClasses: classNames.length,
      totalStudents: 0,
      totalApplications: 0,
      statusCount: {} as Record<string, number>,
    };

    for (const className of classNames) {
      const stats = await this.getClassStatistics(className, teacherId);
      overallStats.totalStudents += stats.studentCount;
      overallStats.totalApplications += stats.totalApplications;
      
      // 合并状态统计
      Object.entries(stats.statusCount).forEach(([status, count]) => {
        overallStats.statusCount[status] = (overallStats.statusCount[status] || 0) + count;
      });
    }

    return overallStats;
  }

  // 获取所有投递记录（带筛选）
  static async getAllApplications(
    teacherId: number,
    filters?: {
      className?: string;
      status?: string;
      channel?: string;
      type?: string;
      startDate?: string;
      endDate?: string;
    }
  ) {
    // 获取该老师管理的所有学生
    const where: any = {};
    
    if (filters?.className) {
      where.className = filters.className;
    }

    const authorizedStudents = await AuthorizedStudent.findAll({
      where,
      attributes: ['name', 'className'],
    });

    // 获取对应的用户 ID
    const studentNames = authorizedStudents.map((s) => s.name);
    const classNames = [...new Set(authorizedStudents.map((s) => s.className))];

    const studentUsers = await User.findAll({
      where: {
        name: { [Op.in]: studentNames },
        className: { [Op.in]: classNames },
        role: 'student',
      },
      attributes: ['id', 'name', 'className'],
    });

    const studentIds = studentUsers.map((u) => u.id);

    // 构建投递记录查询条件
    const appWhere: any = {
      userId: { [Op.in]: studentIds },
    };

    if (filters?.status) {
      appWhere.status = filters.status;
    }
    if (filters?.channel) {
      appWhere.channel = filters.channel;
    }
    if (filters?.type) {
      appWhere.type = filters.type;
    }
    if (filters?.startDate || filters?.endDate) {
      appWhere.applicationDate = {};
      if (filters.startDate) {
        appWhere.applicationDate[Op.gte] = filters.startDate;
      }
      if (filters.endDate) {
        appWhere.applicationDate[Op.lte] = filters.endDate;
      }
    }

    const applications = await Application.findAll({
      where: appWhere,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'className'],
        },
      ],
      order: [['applicationDate', 'DESC']],
    });

    return applications;
  }
}

export default TeacherService;
