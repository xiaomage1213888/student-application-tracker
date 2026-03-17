import { Router } from 'express';
import AuthController from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// 公开路由
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// 需要认证的路由
router.get('/profile', authenticate, AuthController.getProfile);
router.put('/profile', authenticate, AuthController.updateProfile);

export default router;
