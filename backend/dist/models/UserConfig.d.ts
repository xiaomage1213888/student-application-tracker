import { Model } from 'sequelize';
declare class UserConfig extends Model {
    id: number;
    userId: number;
    configKey: string;
    configValue: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default UserConfig;
//# sourceMappingURL=UserConfig.d.ts.map