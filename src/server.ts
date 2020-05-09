import App from './app';

import NecessityController from './controller/NecessityController';

const controllers = [new NecessityController()];
const app = new App(controllers, 3001);

app.listen();

export default app;