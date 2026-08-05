import { dal } from "../utils/dal";

class ErrorLogService{
    public async logError(method:string, route:string, status:number,message:string): Promise<void>{
        const sql = "INSERT INTO errorLogs(errorTime, method, route, status, message) VALUES (NOW(), ?, ?, ?, ?)";
        await dal.execute(sql, [method, route, status, message]);
    }
}

export const errorLogService = new ErrorLogService();