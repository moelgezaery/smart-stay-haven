export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    position: string;
    department: string;
    isActive: boolean;
    hireDate: string;
    createdAt: string;
    lastUpdated?: string;
} 