import express from "express";
import { productController } from "./controllers/productController";
import { appConfig } from "./utils/app-config";
import { loggerMiddleware } from "./middleware/logger-middleware";
import { securityMiddleware } from "./middleware/securityMiddleware";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { userController } from "./controllers/userController";
import expressFileUpload from "express-fileupload";
import { employeeController } from "./controllers/employee-controller";
import { requestLogMiddleware } from "./middleware/requestLogMiddleware";
import cors from "cors";


class App {

    public start(): void {

        // Create our server object:
        const server = express();
        server.use(cors({ origin: "http://localhost:5173", credentials: true }));

        // Prevent DoS attack (rate limiting):
        securityMiddleware.registerRateLimit(server);

        // System middleware:
        server.use(express.json());
        server.use(expressFileUpload());

        // Register "before" middleware:
        server.use(loggerMiddleware.logToConsole);
        server.use(securityMiddleware.blackList);
        server.use(securityMiddleware.preventXss);
        server.use(requestLogMiddleware.logToDB);

        // Register controllers:
        server.use(userController.router);
        server.use(productController.router);
        server.use(employeeController.router);

        // Register "after" middleware:
        server.use(errorMiddleware.routeNotFound);
        server.use(errorMiddleware.catchAll);

        server.listen(appConfig.port, () => console.log("Listening..."));
    }
}

const app = new App();
app.start();