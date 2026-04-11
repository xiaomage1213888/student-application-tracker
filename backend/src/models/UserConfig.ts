import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class UserConfig extends Model {
  public id!: number;
  public userId!: number;
  public configKey!: string;
  public configValue!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    configKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    configValue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'user_configs',
    timestamps: true,
  }
);

export default UserConfig;