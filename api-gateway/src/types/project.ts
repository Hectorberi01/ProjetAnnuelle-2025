
export interface Project {
    id: number;
    name: string;
    description: string;
    soutenanceDate?: Date | null;
    minStudents: number;
    maxStudents: number;
    mode: 'manual' | 'random' | 'free';
    createdAt: Date;
    updatedAt: Date;
    status: 'draft' | 'visible';
    promotionId: number;
}

export interface CreateProject {
    name: string;
    description: string;
    soutenanceDate?: Date | null;
    soutenanceDuration?: number;
    minStudents: number;
    maxStudents: number;
    mode: 'manual' | 'random' | 'free';
    status: 'draft' | 'visible';
    promotionId: number;
}