"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
class ApplicationService {
    static async createApplication(userId, data) {
        const application = await models_1.Application.create({
            userId,
            ...data,
        });
        return application;
    }
    static async getUserApplications(userId, filters) {
        const where = { userId };
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
                    where.applicationDate[sequelize_1.Op.gte] = filters.startDate;
                }
                if (filters.endDate) {
                    where.applicationDate[sequelize_1.Op.lte] = filters.endDate;
                }
            }
            if (filters.company) {
                where.company = { [sequelize_1.Op.like]: `%${filters.company}%` };
            }
            if (filters.position) {
                where.position = { [sequelize_1.Op.like]: `%${filters.position}%` };
            }
        }
        const applications = await models_1.Application.findAll({
            where,
            order: [['applicationDate', 'DESC']],
        });
        return applications;
    }
    static async getApplicationById(id, userId) {
        const application = await models_1.Application.findOne({
            where: { id, userId },
        });
        if (!application) {
            throw new Error('投递记录不存在');
        }
        return application;
    }
    static async updateApplication(id, userId, updates) {
        const application = await this.getApplicationById(id, userId);
        await application.update(updates);
        return application;
    }
    static async deleteApplication(id, userId) {
        const application = await this.getApplicationById(id, userId);
        await application.destroy();
        return true;
    }
    static async getStatistics(userId) {
        const applications = await models_1.Application.findAll({
            where: { userId },
            attributes: ['status', 'type', 'channel'],
        });
        const total = applications.length;
        const statusCount = {};
        const typeCount = {};
        const channelCount = {};
        applications.forEach((app) => {
            const status = app.status || '未设置';
            const type = app.type || '未设置';
            const channel = app.channel || '未设置';
            statusCount[status] = (statusCount[status] || 0) + 1;
            typeCount[type] = (typeCount[type] || 0) + 1;
            channelCount[channel] = (channelCount[channel] || 0) + 1;
        });
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentApplications = await models_1.Application.findAll({
            where: {
                userId,
                applicationDate: { [sequelize_1.Op.gte]: sevenDaysAgo.toISOString().split('T')[0] },
            },
            attributes: ['applicationDate'],
            order: [['applicationDate', 'ASC']],
        });
        const trendData = {};
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
exports.ApplicationService = ApplicationService;
exports.default = ApplicationService;
//# sourceMappingURL=applicationService.js.map