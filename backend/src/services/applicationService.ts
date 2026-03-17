import { Op, WhereOptions } from 'sequelize';
import { Application, User } from '../models';

interface ApplicationFilters {
  channel?: string;
  type?: string;
  status?: string;
  priority?: number;
  startDate?: string;
  endDate?: string;
  company?: string;
  position?: string;
}

export class ApplicationService {
  // 创建投递记录
  static async createApplication(
    userId: number,
    data: {
      company: string;
      position: string;
      applicationDate: string;
      channel?: string;
      type?: string;
      status?: string;
      statusDate?: string;
      location?: string;
      referralCode?: string;
      priority?: number;
      remarks?: string;
    }
  ) {
    const application = await Application.create({
      userId,
      ...data,
    });

    return application;
  }

  // 获取用户的投递记录
  static async getUserApplications(userId: number, filters?: ApplicationFilters) {
    const where: WhereOptions<Application> = { userId };

    if (filters) {
      if (filters.channel) {
        where.channel = filters.channel;
      }
      if (filters.type) {
        where.type = filters.type;
      }
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.priority) {
        where.priority = filters.priority;
      }
      if (filters.startDate || filters.endDate) {
        where.applicationDate = {};
        if (filters.startDate) {
          (where.applicationDate as any)[Op.gte] = filters.startDate;
        }
        if (filters.endDate) {
          (where.applicationDate as any)[Op.lte] = filters.endDate;
        }
      }
      if (filters.company) {
        where.company = { [Op.like]: `%${filters.company}%` };
      }
      if (filters.position) {
        where.position = { [Op.like]: `%${filters.position}%` };
      }
    }

    const applications = await Application.findAll({
      where,
      order: [['applicationDate', 'DESC']],
    });

    return applications;
  }

  // 获取单个投递记录
  static async getApplicationById(id: number, userId: number) {
    const application = await Application.findOne({
      where: { id, userId },
    });

    if (!application) {
      throw new Error('投递记录不存在');
    }

    return application;
  }

  // 更新投递记录
  static async updateApplication(
    id: number,
    userId: number,
    updates: Partial<Application>
  ) {
    const application = await this.getApplicationById(id, userId);
    
    await application.update(updates);
    
    return application;
  }

  // 删除投递记录
  static async deleteApplication(id: number, userId: number) {
    const application = await this.getApplicationById(id, userId);
    
    await application.destroy();
    
    return true;
  }

  // 获取统计数据
  static async getStatistics(userId: number) {
    const applications = await Application.findAll({
      where: { userId },
      attributes: ['status', 'type', 'channel'],
    });

    const total = applications.length;
    
    const statusCount: Record<string, number> = {};
    const typeCount: Record<string, number> = {};
    const channelCount: Record<string, number> = {};

    applications.forEach((app) => {
      const status = app.status || '未设置';
      const type = app.type || '未设置';
      const channel = app.channel || '未设置';

      statusCount[status] = (statusCount[status] || 0) + 1;
      typeCount[type] = (typeCount[type] || 0) + 1;
      channelCount[channel] = (channelCount[channel] || 0) + 1;
    });

    // 获取最近 7 天的投递趋势
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentApplications = await Application.findAll({
      where: {
        userId,
        applicationDate: { [Op.gte]: sevenDaysAgo.toISOString().split('T')[0] },
      },
      attributes: ['applicationDate'],
      order: [['applicationDate', 'ASC']],
    });

    const trendData: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      trendData[dateStr] = 0;
    }

    recentApplications.forEach((app) => {
      const dateStr = app.applicationDate;
      if (trendData[dateStr] !== undefined) {
        trendData[dateStr]++;
      }
    });

    return {
      total,
      statusCount,
      typeCount,
      channelCount,
      trend: trendData,
    };
  }
}

export default ApplicationService;
