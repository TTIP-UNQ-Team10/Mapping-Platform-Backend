import * as express from 'express';
import { createConnection, Connection } from 'typeorm';
var cors = require('cors');

class App {
    public app: express.Application;
    public port: number;
    public connection: Connection; // TypeORM connection to the database

    constructor(controllers: any[], port: number) {
        this.app = express();
        this.port = port;
        this.initializeModels();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private async initializeModels() {
        const connection = await createConnection();
        if (connection === undefined) { throw new Error('Error connecting to database'); }
        connection.synchronize(); // this updates the database schema to match the models' definitions
        this.connection = connection;
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(cors());
    }
    
    private initializeControllers(controllers: any[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    // Boots the application
    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Express server has started on port ${this.port}. Base URL: http://localhost:${this.port}/`);
        });
    }
}

export default App;