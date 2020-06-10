import * as express from 'express';
import { checkJwt } from "../middlewares/checkJwt";
import Controller from './Controller';
import { NecessityType } from '../entity/NecessityType';
import { Category } from '../entity/Category';
import { validate } from "class-validator";

class NecessityTypeController extends Controller {
    public path = '/necessity-types';

    constructor() {
        super();
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.use(this.validateRequest);

        this.router.get(this.path, [checkJwt], this.getAll);
        this.router.get(this.path + '/:id', [checkJwt], this.get);
        
        this.router.post(this.path, [checkJwt], this.create);

        this.router.put(this.path + '/:id', [checkJwt], this.update);

        this.router.delete(this.path + '/:id', [checkJwt], this.delete);
    }

    public async create (req: express.Request, res: express.Response) {
        try {
            const necessityTypeData = req.body;

            const categoryNamesFromRequest = req.body.categories;
            const necessityType = new NecessityType();

            const categoriesArray = []

            if (categoryNamesFromRequest) {
                await Promise.all(categoryNamesFromRequest.map(async (categoryName) => {
                    const newCategory = await Category.findByName(categoryName);
                    categoriesArray.push(newCategory);
                }));
            }

            necessityType.name = necessityTypeData.name;
            necessityType.categories = categoriesArray;
        
            await NecessityType.save(necessityType);

            return res.status(201).send(necessityType);
        } catch (error) {
            return res.status(500).send({ message: 'An error occurred when trying to create a necessity type', error: error.message })
        }
    }

    public async getAll (req: express.Request, res: express.Response) {
        try {
            const necessityTypes = await NecessityType.find();

            return res.status(200).send(necessityTypes);
        } catch (error) {
            return res.status(500).send({ message: 'An error occurred when trying to retrieve all the necessity types', error: error.message })
        }
    }

    public async get (req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        let necessityType: NecessityType;

        try {
            necessityType = await NecessityType.findOneOrFail(id);
            return res.status(200).send(necessityType);
        } catch (error) {
            return res.status(404).send({ message: 'Requested necessity type does not exist'});
        }
    }



    public async update(req: express.Request, res: express.Response) {
        const id = req.params.id;

        const { name, category } = req.body;

        let necessityType: NecessityType;

        try {
            necessityType = await NecessityType.findOneOrFail(id);
        }
        catch (e) {
            return res.status(404).send({ message: "Necessity type not found" });
        }
        
        necessityType.name = name;
        
        const newCategoryToAdd = await Category.findByName(category);
        
        if (newCategoryToAdd) {
            necessityType.categories.push(newCategoryToAdd);
        }

        const errors = await validate(necessityType);
        
        if (errors.length > 0) {
            return res.status(400).send(errors);
        }
        
        try {
            await necessityType.save();
        } catch (e) {
            return res.status(500).send({ message: "An error occurred while trying to update the necessity type", error: e.message });
        }

        return res.status(204).send(necessityType);
    }

    public async delete(req: express.Request, res: express.Response) {
        await NecessityType.delete(req.params.id);
        return res.status(200).send({ message: 'Necessity type deleted successfully!'});
    }
}

export default NecessityTypeController;