import * as express from 'express';
import { createConnection, Connection } from 'typeorm';

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
    }
    
    private initializeControllers(controllers: any[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    // Boots the application
    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

export default App;