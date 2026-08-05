import { dal } from "../utils/dal";

class RequestLogService {
    public async logRequest(method: string, route: string, body: string | null) {
        const sql = "INSERT INTO requestLogs (requestTime, method, requestRoute, body) VALUES (NOW(), ?, ?, ?)";
        await dal.execute(sql, [method, route, body]);
    }
}

export const requestLogService = new RequestLogService();