import * as express from 'express';
import { User } from '../entity/User';
import Controller from './Controller';
import { checkJwt } from "../middlewares/checkJwt";
import { validate } from "class-validator";

class UserController extends Controller {
    public path = '/users';

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
        //Get parameters from the body
        let { email, password, phone  } = req.body;
        let user = new User();
        user.email = email;
        user.password = password;
        user.phone = phone;

        const errors = await validate(user);
        
        if (errors.length > 0) {
            return res.status(400).send(errors);
        }

        //Hash the password, to securely store on DB
        user.hashPassword();

        try {
            await user.save();
        } catch (e) {
            return res.status(409).send({ message: "Email already in use" });
        }

        return res.status(201).send({ message: "User created!" });
    }

    public async getAll (req: express.Request, res: express.Response) {
        const users = await User.find({
            select: ["id", "email", "phone"]
        });

        return res.send(users);
    }

    public async get (req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        let user;

        try {
            user = await User.findOneOrFail({ id }, { select: ["id", "email", "phone"] });
        } catch (error) {
            return res.status(404).send({ message: "User not found" });
        }

        return res.status(200).send(user);
    }

    public async update(req: express.Request, res: express.Response) {
        const id = req.params.id;

        const { email } = req.body;

        let user;
        try {
            user = await User.findOneOrFail(id);
        } catch (error) {
            return res.status(404).send({ message: "User not found" });
        }

        //Validate the new values on model
        user.email = email;
        const errors = await validate(user);
        
        if (errors.length > 0) {
            return res.status(400).send(errors);
        }

        try {
            await user.save();
        } catch (e) {
            res.status(409).send({ message: "Email already in use" });
            return;
        }

        return res.status(204).send({ message: 'User updated!' });
    }

    public async delete(req: express.Request, res: express.Response) {
        const id = req.params.id;

        let user: User;
        try {
            user = await User.findOneOrFail(id);
        } catch (error) {
            return res.status(404).send({ message: "User not found" });
        }
        User.delete(id);

        return res.status(204).send({ message: "User deleted!" });
    }
}

export default UserController;