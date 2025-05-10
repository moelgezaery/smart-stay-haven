export type EmployeeStatus = 'Active' | 'Inactive' | 'OnLeave' | 'Terminated';
export type Department = 'FrontDesk' | 'Housekeeping' | 'Maintenance' | 'FoodAndBeverage' | 'Management' | 'Other';
export type Position = 'Manager' | 'Supervisor' | 'Staff' | 'Trainee' | 'Intern';

export interface Employee {
    id: number;
    employeeId: string;
    name: string;
    position: Position;
    department: Department;
    email: string;
    phone: string;
    startDate: string;
    status: EmployeeStatus;
    schedule?: string;
    createdAt: string;
    lastUpdated?: string;
}

export interface EmployeeCreate {
    employeeId: string;
    name: string;
    position: Position;
    department: Department;
    email: string;
    phone: string;
    startDate: string;
    schedule?: string;
}

export type EmployeeUpdate = Partial<EmployeeCreate> & {
    status?: EmployeeStatus;
}; 