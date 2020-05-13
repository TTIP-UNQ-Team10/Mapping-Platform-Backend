import * as express from 'express';
import { Necessity } from '../entity/Necessity';
import { checkJwt } from "../middlewares/checkJwt";
import Controller from './Controller';

class NecessityController extends Controller {
    public path = '/necessities';

    constructor() {
        super();
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.use(this.validateRequest);

        this.router.get(this.path, this.getAll);
        this.router.get(this.path + '/:id', [checkJwt], this.get);
        
        this.router.post(this.path, [checkJwt], this.create);

        this.router.put(this.path + '/:id', [checkJwt], this.update);

        this.router.delete(this.path + '/:id', [checkJwt], this.delete);
    }

    public async create (req: express.Request, res: express.Response) {
        try {
            const necessityData = req.body;

            const necessity = new Necessity(necessityData.name, necessityData.mappingName, necessityData.type, necessityData.address, necessityData.addressNumber, necessityData.geolocationAddress, necessityData.phone, necessityData.website, necessityData.postalCode, necessityData.coordinate);
        
            await Necessity.save(necessity);

            return res.send(necessity);
        } catch (error) {
            return res.status(500).send({ message: 'An error occurred when trying to create a necessity', error: error })
        }
    }

    public async getAll (req: express.Request, res: express.Response) {
        try {
            const necessities = await Necessity.find();
            return res.send(necessities);
        } catch (error) {
            return res.status(500).send({ message: 'An error occurred when trying to retrieve all the necessities', error: error })
        }
    }

    public async get (req: express.Request, res: express.Response) {
        try {
            const necessity = await Necessity.findOneOrFail(req.params.id);
            return res.send(necessity);
        } catch (error) {
            return res.status(404).send({ message: 'Requested necessity does not exist'});
        }
    }



    public async update(req: express.Request, res: express.Response) {
        const necessity = await Necessity.findOne(req.params.id);
        
        if (necessity !== undefined) {
            await Necessity.update(req.params.id, req.body);
            return res.status(200).send({ message: 'Necessity updated correctly!'});
        }

        return res.status(404).send({ message: 'Necessity not found'});
    }

    public async delete(req: express.Request, res: express.Response) {
        await Necessity.delete(req.params.id);
        return res.status(200).send({ message: 'Necessity deleted successfully!'});
    }
}

export default NecessityController;