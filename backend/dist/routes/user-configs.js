"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const configs = await models_1.UserConfig.findAll({
            where: { userId },
        });
        res.json({
            success: true,
            data: configs,
        });
    }
    catch (error) {
        console.error('获取用户配置失败:', error);
        res.status(500).json({
            success: false,
            message: '获取用户配置失败',
        });
    }
});
router.post('/', auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { key, value } = req.body;
        if (!key || !value) {
            return res.status(400).json({
                success: false,
                message: '配置键和值不能为空',
            });
        }
        let config = await models_1.UserConfig.findOne({
            where: { userId, configKey: key },
        });
        if (config) {
            config.configValue = value;
            await config.save();
        }
        else {
            config = await models_1.UserConfig.create({
                userId,
                configKey: key,
                configValue: value,
            });
        }
        res.json({
            success: true,
            data: config,
        });
    }
    catch (error) {
        console.error('保存用户配置失败:', error);
        res.status(500).json({
            success: false,
            message: '保存用户配置失败',
        });
    }
});
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const configId = parseInt(req.params.id);
        const config = await models_1.UserConfig.findOne({
            where: { id: configId, userId },
        });
        if (!config) {
            return res.status(404).json({
                success: false,
                message: '配置不存在',
            });
        }
        await config.destroy();
        res.json({
            success: true,
            message: '配置删除成功',
        });
    }
    catch (error) {
        console.error('删除用户配置失败:', error);
        res.status(500).json({
            success: false,
            message: '删除用户配置失败',
        });
    }
});
exports.default = router;
//# sourceMappingURL=user-configs.js.map