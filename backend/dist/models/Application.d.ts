import { Model, Optional } from 'sequelize';
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
interface ApplicationCreationAttributes extends Optional<ApplicationAttributes, 'id' | 'channel' | 'type' | 'status' | 'statusDate' | 'location' | 'referralCode' | 'priority' | 'remarks' | 'createdAt' | 'updatedAt'> {
}
export declare class Application extends Model<ApplicationAttributes, ApplicationCreationAttributes> implements ApplicationAttributes {
    id: number;
    userId: number;
    company: string;
    position: string;
    applicationDate: string;
    channel: string | undefined;
    type: string | undefined;
    status: string | undefined;
    statusDate: string | undefined;
    location: string | undefined;
    referralCode: string | undefined;
    priority: number | undefined;
    remarks: string | undefined;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Application;
//# sourceMappingURL=Application.d.ts.map