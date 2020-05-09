import * as express from 'express';
import { Necessity } from '../entity/Necessity';
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
        this.router.get(this.path + '/:id', this.get);
        
        this.router.post(this.path, this.create);

        this.router.put(this.path + '/:id', this.update);

        this.router.delete(this.path + '/:id', this.delete);
    }

    public async create (req: express.Request, res: express.Response) {
        const necessityData = req.body;

        const necessity = new Necessity(necessityData.name, necessityData.mappingName, necessityData.type, necessityData.address, necessityData.addressNumber, necessityData.geolocationAddress, necessityData.phone, necessityData.website, necessityData.postalCode, necessityData.coordinate);
        
        necessity.save();

        return res.send(necessity);
    }

    public async getAll (req: express.Request, res: express.Response) {
        const necessities = await Necessity.find();
        return res.send(necessities);
    }

    public async get (req: express.Request, res: express.Response) {
        const necessity =  await Necessity.findOne(req.params.id);
        return res.send(necessity);
    }



    public async update(req: express.Request, res: express.Response) {
        const necessity = await Necessity.findOne(req.params.id);
        if (necessity !== undefined) {
            const results = await Necessity.update(req.params.id, req.body);
            return res.status(200).send({ message: `Necessity updated correctly! Results: ${results}`});
        }

        return res.status(404).send({ message: 'Necessity not found'});
    }

    public async delete(req: express.Request, res: express.Response) {
        const results = await Necessity.delete(req.params.id);
        return res.status(200).send({ message: `Necessity deleted successfully! Results: ${results}`});
    }
}

export default NecessityController;