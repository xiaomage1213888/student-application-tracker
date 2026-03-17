import { Router } from 'express';
import TeacherController from '../controllers/teacherController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// 所有路由都需要认证且为老师角色
router.use(authenticate);
router.use(requireRole('teacher'));

// 导入学生名单
router.post('/import-students', TeacherController.importStudents);

// 获取学生名单
router.get('/students', TeacherController.getStudents);

// 获取班级列表
router.get('/classes', TeacherController.getClasses);

// 获取班级统计
router.get('/statistics/class/:className', TeacherController.getClassStatistics);

// 获取总体统计
router.get('/statistics/overall', TeacherController.getOverallStatistics);

// 获取所有投递记录
router.get('/applications', TeacherController.getAllApplications);

// 导出投递记录
router.get('/applications/export', TeacherController.exportApplications);

export default router;
