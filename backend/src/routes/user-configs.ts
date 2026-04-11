import express from 'express';
import { UserConfig } from '../models';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// 获取用户配置
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    const configs = await UserConfig.findAll({
      where: { userId },
    });
    res.json({
      success: true,
      data: configs,
    });
  } catch (error) {
    console.error('获取用户配置失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户配置失败',
    });
  }
});

// 保存用户配置
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { key, value } = req.body;

    if (!key || !value) {
      return res.status(400).json({
        success: false,
        message: '配置键和值不能为空',
      });
    }

    // 查找是否已存在该配置
    let config = await UserConfig.findOne({
      where: { userId, configKey: key },
    });

    if (config) {
      // 更新现有配置
      config.configValue = value;
      await config.save();
    } else {
      // 创建新配置
      config = await UserConfig.create({
        userId,
        configKey: key,
        configValue: value,
      });
    }

    res.json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error('保存用户配置失败:', error);
    res.status(500).json({
      success: false,
      message: '保存用户配置失败',
    });
  }
});

// 删除用户配置
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    const configId = parseInt(req.params.id);

    const config = await UserConfig.findOne({
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
  } catch (error) {
    console.error('删除用户配置失败:', error);
    res.status(500).json({
      success: false,
      message: '删除用户配置失败',
    });
  }
});

export default router;