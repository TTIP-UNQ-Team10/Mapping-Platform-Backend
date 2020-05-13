import * as express from 'express';
import Controller from './Controller';
import { checkJwt } from "../middlewares/checkJwt";
import { validate } from "class-validator";
import { Category } from '../entity/Category';

class CategoryController extends Controller {
    public path = '/categories';

    constructor() {
        super();
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.use(this.validateRequest);

        this.router.post(this.path, [checkJwt], this.create);
        this.router.get(this.path, [checkJwt], this.getAll);
        this.router.get(this.path + '/:id', [checkJwt], this.get);

        this.router.put(this.path + '/:id', [checkJwt], this.update);

        this.router.delete(this.path + '/:id', [checkJwt], this.delete);
    }

    public async create (req: express.Request, res: express.Response) {
        let { name, subCategory  } = req.body;
        
        let category = new Category();
        category.name = name;
        category.subCategory = subCategory;

        const errors = await validate(category);
        
        Controller.checkClassValidatorErrors(res, errors);

        try {
            await category.save();
        } catch (e) {
            return res.status(409).send({ message: "Category name already exists" });
        }

        return res.status(201).send({ message: "Category created" });
    }

    public async getAll (req: express.Request, res: express.Response) {
        const categories = await Category.find({
            select: ["id", "name", "subCategory"]
        });

        return res.send(categories);
    }

    public async get (req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        let category;

        try {
            category = await Category.findOneOrFail({ id }, { select: ["id", "name", "subCategory"] });
        } catch (error) {
            return res.status(404).send({ message: "Category not found" });
        }

        return res.send(category);
    }

    public async update(req: express.Request, res: express.Response) {
        const id = req.params.id;

        const { name, subCategory } = req.body;

        let category;
        try {
            category = await Category.findOneOrFail(id);
        } catch (error) {
            return res.status(404).send({ message: "Category not found" });
        }

        category.name = name;
        category.subCategory = subCategory;

        const errors = await validate(category);
        
        if (errors.length > 0) {
            return res.status(400).send(errors);
        }

        try {
            await category.save();
        } catch (e) {
            res.status(409).send({ message: "Category name already in use" });
            return;
        }

        return res.status(204).send({ message: 'Category updated!' });
    }

    public async delete(req: express.Request, res: express.Response) {
        const id = req.params.id;

        let category: Category;
        try {
            category = await Category.findOneOrFail(id);
        } catch (error) {
            return res.status(404).send({ message: "Category not found" });
        }
        
        Category.delete(id);

        return res.status(204).send({ message: "Category deleted!" });
    }
}

export default CategoryController;