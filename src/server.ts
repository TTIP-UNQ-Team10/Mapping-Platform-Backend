import App from './app';

import NecessityController from './controller/NecessityController';
import AuthController from './controller/AuthController';
import UserController from './controller/UserController';

const controllers = [new NecessityController(), new AuthController(), new UserController()];
const app = new App(controllers, 3001);

app.listen();

export default app;