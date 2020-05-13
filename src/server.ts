import App from './app';

import NecessityController from './controller/NecessityController';
import AuthController from './controller/AuthController';
import UserController from './controller/UserController';
import CategoryController from './controller/CategoryController';

const controllers = [new NecessityController(), new AuthController(), new UserController(), new CategoryController()];
const app = new App(controllers, 3001);

app.listen();

export default app;