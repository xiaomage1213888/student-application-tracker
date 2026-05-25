import sequelize from '../config/database';
import User from './User';
import AuthorizedStudent from './AuthorizedStudent';
import Application from './Application';
import UserConfig from './UserConfig';
export declare const syncDatabase: () => Promise<void>;
export { User, AuthorizedStudent, Application, UserConfig };
export { testConnection } from '../config/database';
export default sequelize;
//# sourceMappingURL=index.d.ts.map