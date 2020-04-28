import App from './app';

import NecessityController from './controller/NecessityController';

const controllers = [new NecessityController()];
const app = new App(controllers, 3001);

app.listen();

console.log("Express server has started on port 3001. Base URL: http://localhost:3001/");

export default app;