import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ApplicationAttributes {
  id: number;
  userId: number;
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
  createdAt?: Date;
  updatedAt?: Date;
}

interface ApplicationCreationAttributes extends Optional<ApplicationAttributes, 'id' | 'channel' | 'type' | 'status' | 'statusDate' | 'location' | 'referralCode' | 'priority' | 'remarks' | 'createdAt' | 'updatedAt'> {}

export class Application extends Model<ApplicationAttributes, ApplicationCreationAttributes> implements ApplicationAttributes {
  public id!: number;
  public userId!: number;
  public company!: string;
  public position!: string;
  public applicationDate!: string;
  public channel!: string | undefined;
  public type!: string | undefined;
  public status!: string | undefined;
  public statusDate!: string | undefined;
  public location!: string | undefined;
  public referralCode!: string | undefined;
  public priority!: number | undefined;
  public remarks!: string | undefined;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Application.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    company: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    applicationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    channel: {
      type: DataTypes.ENUM(
        'Boss 直聘',
        '实习僧',
        '公司官网',
        '内推',
        '智联招聘',
        '牛客网',
        '其他'
      ),
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('实习', '秋招正式批'),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        '已投递/未处理',
        '简历筛选',
        '笔试/测评',
        '面试中',
        'OC',
        'Offer',
        '已拒',
        '已结束'
      ),
      defaultValue: '已投递/未处理',
    },
    statusDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    referralCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'applications',
    underscored: true,
  }
);

export default Application;
