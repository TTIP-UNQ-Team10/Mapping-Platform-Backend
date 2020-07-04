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

        this.router.get(this.path, this.getAll);
        this.router.get(this.path + '/:id', this.get);

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

            if (!necessityType.name) {
                return res.status(400).send({ message: 'El campo Nombre es requerido' })
            }

            necessityType.categories = categoriesArray;

            await NecessityType.save(necessityType);

            return res.status(201).send(necessityType);
        } catch (error) {
            return res.status(500).send({ message: 'Ha ocurrido un error al intentar crear un tipo de necesidad', error: error.message })
        }
    }

    public async getAll (req: express.Request, res: express.Response) {
        try {
            const necessityTypes = await NecessityType.find();

            return res.status(200).send(necessityTypes);
        } catch (error) {
            return res.status(500).send({ message: 'Ha ocurrido un error al intentar obtener todos los tipos de necesidad disponibles', error: error.message })
        }
    }

    public async get (req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        let necessityType: NecessityType;

        try {
            necessityType = await NecessityType.findOne(id);

            if (!necessityType) {
                return res.status(404).send({ message: 'El tipo de necesidad solicitado no existe'});
            }

            return res.status(200).send(necessityType);
        } catch (error) {
            return res.status(500).send({ message: 'Ha ocurrido un error al intentar obtener el tipo de necesidad', error: error.message })
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
            return res.status(404).send({ message: "El tipo de necesidad solicitado no fue encontrado" });
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
            return res.status(500).send({ message: "Ha ocurrido un error al intentar actualizar el tipo de necesidad", error: e.message });
        }

        return res.status(200).send(necessityType);
    }

    public async delete(req: express.Request, res: express.Response) {
        try {
            await NecessityType.delete(req.params.id);
            return res.status(200).send({ message: 'El tipo de necesidad se ha eliminado con éxito'});
        }
        catch (error) {
            return res.status(500).send({ message: "Ha ocurrido un error al intentar eliminar el tipo de necesidad", error: error.message });
        }
    }
}

export default NecessityTypeController;
