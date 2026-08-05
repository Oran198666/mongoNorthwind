import { dal } from "../utils/dal";
import { EmployeeModel } from "../models/EmployeeModel";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enum";

class EmployeeService {

    public async getAllEmployees(): Promise<EmployeeModel[]> {
        const sql = `
            SELECT e.id, e.firstName, e.lastName, e.title,
                   c.name AS city,
                   co.name AS country
            FROM employees e
            LEFT JOIN cities c ON e.cityId = c.id
            LEFT JOIN countries co ON c.countryId = co.id
        `;
        const employees = await dal.execute(sql) as EmployeeModel[];
        return employees;
    }

    public async getOneEmployee(id: number): Promise<EmployeeModel> {
        const sql = `
            SELECT e.id, e.firstName, e.lastName, e.title,
                   c.name AS city,
                   co.name AS country
            FROM employees e
            LEFT JOIN cities c ON e.cityId = c.id
            LEFT JOIN countries co ON c.countryId = co.id
            WHERE e.id = ?
        `;
        const employees = await dal.execute(sql, [id]) as EmployeeModel[];
        const employee = employees[0];
        if (!employee) throw new ClientError(StatusCode.NotFound, `id ${id} not found.`);
        return employee;
    }
}

export const employeeService = new EmployeeService();