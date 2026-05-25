"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = __importDefault(require("../services/authService"));
class AuthController {
    static async register(req, res) {
        try {
            const { username, password, name, className, email, phone } = req.body;
            if (!username || !password || !name || !className) {
                return res.status(400).json({
                    success: false,
                    message: '请填写必填字段',
                });
            }
            const result = await authService_1.default.registerStudent(username, password, name, className, email, phone);
            res.status(201).json({
                success: true,
                message: '注册成功',
                data: result,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || '注册失败',
            });
        }
    }
    static async login(req, res) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: '请填写用户名和密码',
                });
            }
            const result = await authService_1.default.login(username, password);
            res.json({
                success: true,
                message: '登录成功',
                data: result,
            });
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: error.message || '登录失败',
            });
        }
    }
    static async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const profile = await authService_1.default.getUserProfile(userId);
            res.json({
                success: true,
                data: profile,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error.message || '获取用户信息失败',
            });
        }
    }
    static async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const updates = req.body;
            const profile = await authService_1.default.updateUserProfile(userId, updates);
            res.json({
                success: true,
                message: '更新成功',
                data: profile,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || '更新失败',
            });
        }
    }
}
exports.AuthController = AuthController;
exports.default = AuthController;
//# sourceMappingURL=authController.js.map