"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherService = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const database_1 = require("../config/database");
class TeacherService {
    static async importAuthorizedStudents(students, teacherId) {
        const transaction = await database_1.sequelize.transaction();
        try {
            const results = [];
            for (const student of students) {
                const [record, created] = await models_1.AuthorizedStudent.findOrCreate({
                    where: {
                        name: student.name,
                        className: student.className,
                    },
                    defaults: {
                        name: student.name,
                        className: student.className,
                        isUsed: false,
                    },
                    transaction,
                });
                if (!created) {
                    await record.update({ isUsed: false, usedByUserId: null }, { transaction });
                }
                results.push(record);
            }
            await transaction.commit();
            return results;
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    static async getManagedStudents(teacherId, className) {
        const where = {};
        if (className) {
            where.className = className;
        }
        const students = await models_1.AuthorizedStudent.findAll({
            where,
            include: [
                {
                    model: models_1.User,
                    as: 'manager',
                    where: { id: teacherId },
                    required: false,
                },
            ],
            order: [['className', 'ASC'], ['name', 'ASC']],
        });
        return students;
    }
    static async getClassNames(teacherId) {
        const students = await models_1.AuthorizedStudent.findAll({
            attributes: ['className'],
            group: ['className'],
            raw: true,
        });
        return students.map((s) => s.className).filter(Boolean);
    }
    static async getClassStatistics(className, teacherId) {
        const studentUsers = await models_1.User.findAll({
            where: {
                className,
                role: 'student',
            },
            attributes: ['id', 'name', 'username'],
        });
        const studentIds = studentUsers.map((u) => u.id);
        const applications = await models_1.Application.findAll({
            where: {
                userId: {
                    [sequelize_1.Op.in]: studentIds,
                },
            },
        });
        const totalApplications = applications.length;
        const studentCount = studentUsers.length;
        const avgApplications = studentCount > 0 ? (totalApplications / studentCount).toFixed(2) : '0';
        const statusCount = {};
        applications.forEach((app) => {
            const status = app.status || '未设置';
            statusCount[status] = (statusCount[status] || 0) + 1;
        });
        const studentRanks = [];
        for (const student of studentUsers) {
            const count = await models_1.Application.count({
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
    static async getOverallStatistics(teacherId) {
        const classNames = await this.getClassNames(teacherId);
        const overallStats = {
            totalClasses: classNames.length,
            totalStudents: 0,
            totalApplications: 0,
            statusCount: {},
        };
        for (const className of classNames) {
            const stats = await this.getClassStatistics(className, teacherId);
            overallStats.totalStudents += stats.studentCount;
            overallStats.totalApplications += stats.totalApplications;
            Object.entries(stats.statusCount).forEach(([status, count]) => {
                overallStats.statusCount[status] = (overallStats.statusCount[status] || 0) + count;
            });
        }
        return overallStats;
    }
    static async getAllApplications(teacherId, filters) {
        const where = {};
        if (filters?.className) {
            where.className = filters.className;
        }
        const authorizedStudents = await models_1.AuthorizedStudent.findAll({
            where,
            attributes: ['name', 'className'],
        });
        const studentNames = authorizedStudents.map((s) => s.name);
        const classNames = [...new Set(authorizedStudents.map((s) => s.className))];
        const studentUsers = await models_1.User.findAll({
            where: {
                name: { [sequelize_1.Op.in]: studentNames },
                className: { [sequelize_1.Op.in]: classNames },
                role: 'student',
            },
            attributes: ['id', 'name', 'className'],
        });
        const studentIds = studentUsers.map((u) => u.id);
        const appWhere = {
            userId: { [sequelize_1.Op.in]: studentIds },
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
                appWhere.applicationDate[sequelize_1.Op.gte] = filters.startDate;
            }
            if (filters.endDate) {
                appWhere.applicationDate[sequelize_1.Op.lte] = filters.endDate;
            }
        }
        const applications = await models_1.Application.findAll({
            where: appWhere,
            include: [
                {
                    model: models_1.User,
                    as: 'user',
                    attributes: ['id', 'name', 'className'],
                },
            ],
            order: [['applicationDate', 'DESC']],
        });
        return applications;
    }
}
exports.TeacherService = TeacherService;
exports.default = TeacherService;
//# sourceMappingURL=teacherService.js.map