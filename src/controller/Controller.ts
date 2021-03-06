import * as express from 'express';
import { Necessity } from '../entity/Necessity';

abstract class Controller {
    public router: express.Router

    constructor() {
        this.router = express.Router();
    }

    public abstract initializeRoutes();

    public validateRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
        //TODO: Refactor this to a strategy
        const params = {id: req.url.split('/')[2]};
        switch (req.method) {
            case 'GET':
                break;
            case 'DELETE':
                if (!params.id) { return res.status(400).send({ message: 'Id es requerido'}); }
                break;
            case 'POST':
                if (Object.keys(req.body).length === 0) { return res.status(400).send({ message: "El cuerpo de la solicitud no puede ser vacío"}); }
                break;
            case 'PUT':
                if (!params.id) { return res.status(400).send({ message: 'Id es requerido'}); }
                if (Object.keys(req.body).length === 0) { return res.status(400).send({ message: "El cuerpo de la solicitud no puede ser vacío"}); }
                break;
        }
        next();
    }

    public static checkClassValidatorErrors(res, errors) {
        if (errors.length > 0) {
            return res.status(400).send(errors);
        }
    }

    public abstract async create (req: express.Request, res: express.Response);

    public abstract async getAll (req: express.Request, res: express.Response);

    public abstract async get (req: express.Request, res: express.Response);

    public abstract async update(req: express.Request, res: express.Response);

    public abstract async delete(req: express.Request, res: express.Response);
}

export default Controller;