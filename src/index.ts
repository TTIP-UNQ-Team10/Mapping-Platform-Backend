import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
// import { Routes } from "./routes";
import { Necessity } from "./entity/Necessity";
var cors = require('cors');

createConnection().then(async connection => {

    const necessityRepository = connection.getRepository(Necessity);

    // create express app
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    // register express routes from defined application routes
    registerRoutes(app);

    app.get("/necessities", async (req: Request, res: Response) => {
        const necessities = await necessityRepository.find();
        return res.send(necessities);
    });

    app.get("/necessities/:id", async (req: Request, res: Response) => {
        const results = await necessityRepository.findOne(req.params.id);
        return res.send(results);
    });

    app.post("/necessities", async (req: Request, res: Response) => {
        const user = await necessityRepository.create(req.body);
        const results = await necessityRepository.save(user);
        return res.send(results);
    });

    app.put("/necessities/:id", async (req: Request, res: Response) => {
        const necessity = await necessityRepository.findOne(req.params.id);
        necessityRepository.merge(necessity, req.body);
        const results = await necessityRepository.save(necessity);
        return res.send(results);
    });

    app.delete("/necessities/:id", async (req: Request, res: Response) => {
        const results = await necessityRepository.delete(req.params.id);
        return res.send(results);
    });

    // start express server
    app.listen(3001);

    console.log("Express server has started on port 3001. Base URL: http://localhost:3001/");

}).catch(error => console.log(error));

// function registerRoutes(app: any) {
//     Routes.forEach(route => {
//         (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
//             const result = (new (route.controller as any))[route.action](req, res, next);
//             if (result instanceof Promise) {
//                 result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
//             }
//             else if (result !== null && result !== undefined) {
//                 res.json(result);
//             }
//         });
//     });
// }
