import * as express from 'express';
import * as typeorm from 'typeorm';
import { Necessity } from '../entity/Necessity';

class NecessityController {
    public path = '/necessities';
    public router: express.Router = express.Router();
    private necessityRepository = typeorm.getRepository(Necessity);

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        // UserController middleware
        this.router.use(this.validateInput);

        this.router.get(this.path, this.getAllNecessities);
        this.router.get(this.path + '/:id', this.getNecessity);
        
        this.router.post(this.path, this.createNecessity);

        this.router.put(this.path + '/:id', this.updateNecessity);

        this.router.delete(this.path + '/:id', this.deleteNecessity);
    }

    public validateInput(req: express.Request, res: express.Response, next: express.NextFunction) {
        //TODO: Refactor this to a strategy
        const params = {id: req.url.split('/')[2]};
        switch (req.method) {
            case 'GET':
                break;
            case 'DELETE':
                if (!params.id) { return res.status(400).send({ message: 'Id is required'}); }
                break;
            case 'POST':
                if (Object.keys(req.body).length === 0) { return res.status(400).send({ message: "Request body can't be empty"}); }
                break;
            case 'PUT':
                if (!params.id) { return res.status(400).send({ message: 'Id is required'}); }
                if (Object.keys(req.body).length === 0) { return res.status(400).send({ message: "Request body can't be empty"}); }
                break;
        }
        next();
    }

    public async createNecessity (req: express.Request, res: express.Response) {
        const necessityData = req.body;

        const necessity = new Necessity(necessityData.name, necessityData.mappingName, necessityData.type, necessityData.address, necessityData.addressNumber, necessityData.geolocationAddress, necessityData.phone, necessityData.website, necessityData.postalCode, necessityData.coordinate);
        
        this.necessityRepository.save(necessity);

        return res.send(necessity);
    }

    public async getAllNecessities (req: express.Request, res: express.Response) {
        const necessities = await this.necessityRepository.find();
        return res.send(necessities);
    }

    public async getNecessity (req: express.Request, res: express.Response) {
        const necessity =  await this.necessityRepository.findOne(req.params.id);
        return res.send(necessity);
    }



    public async updateNecessity(req: express.Request, res: express.Response) {
        const necessity = await this.necessityRepository.findOne(req.params.id);
        if (necessity !== undefined) {
            this.necessityRepository.merge(necessity, req.body);
            const results = await this.necessityRepository.save(necessity);
            return res.status(200).send({ message: `Necessity updated correctly! Results: ${results}`});
        }

        return res.status(404).send({ message: 'Necessity not found'});
    }

    public async deleteNecessity(req: express.Request, res: express.Response) {
        const results = await this.necessityRepository.delete(req.params.id);
        return res.status(200).send({ message: `Necessity deleted successfully! Results: ${results}`});
    }
}

export default NecessityController;