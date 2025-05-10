import { api } from './api';
import { Employee, EmployeeCreate, EmployeeUpdate, EmployeeStatus, Department, Position } from '../types/employee';

export const employeeService = {
    async getEmployees(): Promise<Employee[]> {
        const response = await api.get<Employee[]>('/api/employee');
        return response.data;
    },

    async getEmployee(id: number): Promise<Employee> {
        const response = await api.get<Employee>(`/api/employee/${id}`);
        return response.data;
    },

    async createEmployee(employee: EmployeeCreate): Promise<Employee> {
        const response = await api.post<Employee>('/api/employee', employee);
        return response.data;
    },

    async updateEmployee(id: number, employee: EmployeeUpdate): Promise<void> {
        await api.put(`/api/employee/${id}`, employee);
    },

    async deleteEmployee(id: number): Promise<void> {
        await api.delete(`/api/employee/${id}`);
    },

    async getEmployeesByStatus(status: EmployeeStatus): Promise<Employee[]> {
        const response = await api.get<Employee[]>(`/api/employee/status/${status}`);
        return response.data;
    },

    async getEmployeesByDepartment(department: Department): Promise<Employee[]> {
        const response = await api.get<Employee[]>(`/api/employee/department/${department}`);
        return response.data;
    },

    async getEmployeesByPosition(position: Position): Promise<Employee[]> {
        const response = await api.get<Employee[]>(`/api/employee/position/${position}`);
        return response.data;
    },

    async searchEmployees(query: string): Promise<Employee[]> {
        const response = await api.get<Employee[]>(`/api/employee/search?query=${encodeURIComponent(query)}`);
        return response.data;
    },

    async getEmployeeSchedule(id: number): Promise<Employee> {
        const response = await api.get<Employee>(`/api/employee/${id}/schedule`);
        return response.data;
    }
}; 