import { AuthorizedStudent, Application } from '../models';
export declare class TeacherService {
    static importAuthorizedStudents(students: Array<{
        name: string;
        className: string;
    }>, teacherId: number): Promise<AuthorizedStudent[]>;
    static getManagedStudents(teacherId: number, className?: string): Promise<AuthorizedStudent[]>;
    static getClassNames(teacherId: number): Promise<any[]>;
    static getClassStatistics(className: string, teacherId: number): Promise<{
        className: string;
        studentCount: number;
        totalApplications: number;
        avgApplications: string;
        statusCount: Record<string, number>;
        studentRanks: {
            studentId: number;
            studentName: string;
            count: number;
        }[];
    }>;
    static getOverallStatistics(teacherId: number): Promise<{
        totalClasses: number;
        totalStudents: number;
        totalApplications: number;
        statusCount: Record<string, number>;
    }>;
    static getAllApplications(teacherId: number, filters?: {
        className?: string;
        status?: string;
        channel?: string;
        type?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<Application[]>;
}
export default TeacherService;
//# sourceMappingURL=teacherService.d.ts.map