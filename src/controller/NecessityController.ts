import * as express from 'express';
import { Necessity } from '../entity/Necessity';
import { checkJwt } from "../middlewares/checkJwt";
import Controller from './Controller';
import { Category } from '../entity/Category';
import { validate } from "class-validator";
import { NecessityType } from '../entity/NecessityType';

class NecessityController extends Controller {
    public path = '/necessities';

    constructor() {
        super();
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.use(this.validateRequest);

        this.router.get(this.path, this.getAll);
        this.router.get(this.path + '/:category', this.getAllByCategory);
        this.router.get(this.path + '/:id', this.get);
        
        this.router.post(this.path, [checkJwt], this.create);

        this.router.put(this.path + '/:id', this.update);

        this.router.delete(this.path + '/:id', [checkJwt], this.delete);
    }

    public async create (req: express.Request, res: express.Response) {
        try {
            const necessityData = req.body;

            const necessity = new Necessity();

            necessity.name = necessityData.name;
            necessity.type = await NecessityType.findByName(necessityData.type);
            necessity.description = necessityData.description;
            necessity.category = await Category.findByName(necessityData.category);
            necessity.location = necessityData.location;

            const errors = await validate(necessity);
        
            Controller.checkClassValidatorErrors(res, errors);
        
            await Necessity.save(necessity);

            return res.status(201).send(necessity);
        } catch (error) {
            return res.status(500).send({ message: 'An error occurred when trying to create a necessity', error: error.message })
        }
    }

    public async getAll (req: express.Request, res: express.Response) {
        try {
            const necessities = await Necessity.find();

            return res.status(200).send(necessities);
        } catch (error) {
            return res.status(500).send({ message: 'An error occurred when trying to retrieve all the necessities', error: error.message })
        }
    }

    public async getAllByCategory (req: express.Request, res: express.Response) {
        try {
            const necessities = await Necessity.find();

            const filteredNecessities = necessities.filter(necessity => necessity.category.name === req.params.category);

            return res.status(200).send(filteredNecessities);
        } catch (error) {
            return res.status(500).send({ message: 'An error occurred when trying to retrieve all the necessities by category', error: error.message })
        }
    }

    public async get (req: express.Request, res: express.Response) {
        try {
            const necessity = await Necessity.findOneOrFail(req.params.id);
            return res.status(200).send(necessity);
        } catch (error) {
            return res.status(404).send({ message: 'Requested necessity does not exist'});
        }
    }



    public async update(req: express.Request, res: express.Response) {
        const necessity = await Necessity.findOne(req.params.id);
        
        if (necessity !== undefined) {
            if (req.body.category) {
                const aCategory = await Category.findByName(req.body.category);
    
                if (aCategory) {
                    this.handleCategoryUpdate(req, necessity, aCategory);
                }
                else {
                    return res.status(404).send({ message: 'The category requested was not found'});
                }
            }

            await Necessity.update(req.params.id, req.body);
            return res.status(200).send(necessity);
        }

        return res.status(404).send({ message: 'Necessity not found'});
    }

    public async delete(req: express.Request, res: express.Response) {
        await Necessity.delete(req.params.id);
        return res.status(200).send({ message: 'Necessity deleted successfully!'});
    }

    public async handleCategoryUpdate(req, necessity, aCategory) {
        await Necessity.createQueryBuilder().relation(Necessity, "category").of(necessity).add(aCategory);
    
        delete req.body.category
    }
}

export default NecessityController;