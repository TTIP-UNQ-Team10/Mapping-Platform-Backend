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
        this.router.get(this.path, this.getAll);
        this.router.get(this.path + '/:id', this.get);

        this.router.put(this.path + '/:id', [checkJwt], this.update);

        this.router.delete(this.path + '/:id', [checkJwt], this.delete);
    }

    public async create (req: express.Request, res: express.Response) {
        let { name  } = req.body;

        let category = new Category();
        category.name = name;

        const errors = await validate(category);

        Controller.checkClassValidatorErrors(res, errors);

        try {
            await category.save();
        } catch (e) {
            return res.status(409).send({ message: "El nombre ingresado para crear la categoría ya existe", error: e });
        }

        return res.status(201).send(category);
    }

    public async getAll (req: express.Request, res: express.Response) {
        const categories = await Category.find({
            select: ["id", "name"],
            relations: ["necessityType"]
        });

        return res.status(200).send(categories);
    }

    public async get (req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        let category;

        try {
            category = await Category.findOneOrFail({ id }, { select: ["id", "name"], relations: ["necessityType"] });
        } catch (error) {
            return res.status(404).send({ message: "No se encontró la categoría" });
        }

        return res.status(200).send(category);
    }

    public async update(req: express.Request, res: express.Response) {
        const id = req.params.id;

        const { name } = req.body;

        let category;
        try {
            category = await Category.findOneOrFail(id);
        } catch (error) {
            return res.status(404).send({ message: "No se encontró la categoría" });
        }

        category.name = name;

        const errors = await validate(category);

        if (errors.length > 0) {
            return res.status(400).send(errors);
        }

        try {
            await category.save();
        } catch (e) {
            return res.status(409).send({ message: "El nombre ingresado para la categoría ya está en uso" });
        }

        return res.status(200).send(category);
    }

    public async delete(req: express.Request, res: express.Response) {
        const id = req.params.id;

        let category: Category;
        try {
            category = await Category.findOneOrFail({ id }, { relations: [ "associatedNecessities" ] });
        } catch (error) {
            return res.status(404).send({ message: "No se encontró la categoría" });
        }

        if (category.associatedNecessities.length > 0) {
            return res.status(400).send({ message: `No se ha podido borrar esta categoría, ya que hay necesidades asociadas a ella. Necesidades: ${JSON.stringify(category.associatedNecessities)}` });
        }

        Category.delete(id);

        return res.status(200).send({ message: "Categoría borrada con éxito" });
    }
}

export default CategoryController;
