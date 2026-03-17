import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import AuthService from '../services/authService';

export class AuthController {
  // 学生注册
  static async register(req: Request, res: Response) {
    try {
      const { username, password, name, className, email, phone } = req.body;

      // 验证必填字段
      if (!username || !password || !name || !className) {
        return res.status(400).json({
          success: false,
          message: '请填写必填字段',
        });
      }

      const result = await AuthService.registerStudent(
        username,
        password,
        name,
        className,
        email,
        phone
      );

      res.status(201).json({
        success: true,
        message: '注册成功',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '注册失败',
      });
    }
  }

  // 用户登录
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: '请填写用户名和密码',
        });
      }

      const result = await AuthService.login(username, password);

      res.json({
        success: true,
        message: '登录成功',
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || '登录失败',
      });
    }
  }

  // 获取当前用户信息
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const profile = await AuthService.getUserProfile(userId);

      res.json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || '获取用户信息失败',
      });
    }
  }

  // 更新用户信息
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const updates = req.body;

      const profile = await AuthService.updateUserProfile(userId, updates);

      res.json({
        success: true,
        message: '更新成功',
        data: profile,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '更新失败',
      });
    }
  }
}

export default AuthController;
