import express from "express";
import { productController } from "./controllers/productController";
import { appConfig } from "./utils/app-config";
import { loggerMiddleware } from "./middleware/logger-middleware";
import { securityMiddleware } from "./middleware/securityMiddleware";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { userController } from "./controllers/userController";
import expressFileUpload from "express-fileupload";
import { categoryController } from "./controllers/categoryController";
import { employeeController } from "./controllers/employee-controller";
import { requestLogMiddleware } from "./middleware/requestLogMiddleware";
import { dal } from "./utils/dal";
import { saleController } from "./controllers/SaleController";
import "./models/countryModel";
import { supplierController } from "./controllers/SupplierController";
import helmet from "helmet";
import cors from "cors";


class App {

    public async start(): Promise<void> {


        await dal.connect();

        // Create our server object:
        const server = express();

        server.use(cors({ origin: "http://localhost:5173", credentials: true }));

        // Prevent DoS attack (rate limiting):
        securityMiddleware.registerRateLimit(server);
        securityMiddleware.helmetProtection(server);

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
        server.use(supplierController.router);
        server.use(saleController.router);
        server.use(categoryController.router);

        // Register "after" middleware:
        server.use(errorMiddleware.routeNotFound);
        server.use(errorMiddleware.catchAll);

        server.listen(appConfig.port, () => console.log("Listening..."));
    }
}

const app = new App();
app.start();