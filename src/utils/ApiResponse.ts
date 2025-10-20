import { Response } from "express";

export class ApiResponse {
    static success(res: Response, data: any, message = "Success") {
        return res.status(200).json({ success: true, message, data });
    }

    static error(res: Response, message = "Error", statusCode = 500) {
        return res.status(statusCode).json({ success: false, message });
    }
}
