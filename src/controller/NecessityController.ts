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
        this.router.get(this.path + '/type/:necessityType', this.getAllByNecessityType)

        this.router.post(this.path, this.create);

        this.router.put(this.path + '/:id', this.update);

        this.router.delete(this.path + '/:id', [checkJwt], this.delete);
    }

    public async create (req: express.Request, res: express.Response) {
        try {
            const necessityData = req.body;

            const necessity = new Necessity();

            const type = await NecessityType.findByName(necessityData.type);
            const category = await Category.findByName(necessityData.category);

            necessity.name = necessityData.name;
            necessity.type = type;
            necessity.description = necessityData.description;
            necessity.category = category;
            necessity.location = necessityData.location;

            const errors = await validate(necessity);

            Controller.checkClassValidatorErrors(res, errors);

            await Necessity.save(necessity);

            return res.status(201).send(necessity);
        } catch (error) {
            return res.status(500).send({ message: 'Ha ocurrido un error al crear una necesidad', error: error.message })
        }
    }

    public async getAll (req: express.Request, res: express.Response) {
        try {
            const necessities = await Necessity.find();

            return res.status(200).send(necessities);
        } catch (error) {
            return res.status(500).send({ message: 'Ha ocurrido un error al obtener todas las necesidades', error: error.message })
        }
    }

    public async getAllByCategory (req: express.Request, res: express.Response) {
        try {
            const category = await Category.findByName(req.params.category);
            const necessities = await Necessity.find({ relations: ["category"], where: { category: category } });

            return res.status(200).send(necessities);
        } catch (error) {
            return res.status(500).send({ message: 'Ha ocurrido un error al obtener las necesidades en base a la categoría ingresada', error: error.message })
        }
    }

    public async get (req: express.Request, res: express.Response) {
        try {
            const necessity = await Necessity.findOne(req.params.id);

            if (!necessity) {
                return res.status(404).send({ message: 'La necesidad solicitada no existe'});
            }

            return res.status(200).send(necessity);
        } catch (error) {
            return res.status(500).send({ message: 'Ha ocurrido un error al intentar obtener la necesidad', error: error.message })
        }
    }



    public async update(req: express.Request, res: express.Response) {
        try {
            const necessity = await Necessity.findOne(req.params.id);
        
            if (necessity !== undefined) {
                if (req.body.category) {
                    const aCategory = await Category.findByName(req.body.category);
        
                    if (aCategory) {
                        this.handleCategoryUpdate(req, necessity, aCategory);
                        await Necessity.save(necessity);
                    }
                    else {
                        return res.status(404).send({ message: 'La categoría solicitada no fue encontrada'});
                    }
                }

                await Necessity.update(req.params.id, req.body);
                const newNecessity = await Necessity.findOne(req.params.id);
                return res.status(200).send(newNecessity);
            }

            return res.status(404).send({ message: 'No se encontró la necesidad'});
        }
        catch (error) {
            return res.status(500).send({ message: 'Ha ocurrido un error al intentar actualizar la necesidad', error: error.message })
        }
    }

    public async delete(req: express.Request, res: express.Response) {
        try {
            await Necessity.delete(req.params.id);
            return res.status(200).send({ message: 'Necesidad borrada con éxito'});
        }
        catch (error) {
            return res.status(500).send({ message: 'Ha ocurrido un error al intentar borrar la necesidad', error: error.message })
        }
    }

    public async handleCategoryUpdate(req, necessity, aCategory) {
        necessity.category = aCategory;

        delete req.body.category
    }


    public async getAllByNecessityType(req: express.Request, res: express.Response) {
      try {
        const necessityType = await NecessityType.findByName(req.params.necessityType);
        const necessities = await Necessity.find({ relations: ["type"], where: { type: necessityType } });

        return res.status(200).send(necessities)

      } catch (error) {
        return res.status(500).send({ message: 'Ha ocurrido un error al intentar obtener las necesidades en base al tipo de necesidad ingresado', error: error.message })
      }
    }
}

export default NecessityController;
