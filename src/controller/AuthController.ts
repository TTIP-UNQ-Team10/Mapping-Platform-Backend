import * as express from 'express';
import { User } from '../entity/User';
import { checkJwt } from "../middlewares/checkJwt";
import config from "../config/config";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";

class AuthController {
    public path = '/auth';
    public router: express.Router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(this.path, this.login);

        //Change my password
        this.router.post("/change-password", [checkJwt], this.changePassword);
    }

    public async login (req: express.Request, res: express.Response)
    {
        //Check if email and password are set
        let { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).send({ message: 'Email y contraseña son requeridos'});
        }

        let user: User;

        try {
            user = await User.findOneOrFail({ email: email });
        } catch (error) {
            return res.status(401).send({ message: 'El usuario solicitado no existe'});
        }

        //Check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            return res.status(401).send({ message: 'Contraseña inválida'});
        }

        //Sing JWT, valid for 1 hour
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            config.jwtSecret,
            { expiresIn: "1h" }
        );

        return res.status(200).send({ token: token });
    }

    public async changePassword (req: express.Request, res: express.Response) {
        //Get ID from JWT
        const id = res.locals.jwtPayload.userId;

        //Get parameters from the body
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
            return res.status(400).send({ message: 'Old password and new password are required' });
        }

        let user: User;
        try {
            user = await User.findOneOrFail({ id: id })
        } catch (id) {
            return res.status(401).send({ message: 'User not found' });
        }

        //Check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            return res.status(401).send({ message: 'Old password is not valid' });
        }

        user.password = newPassword;
        const errors = await validate(user);

        if (errors.length > 0) {
            return res.status(400).send(errors);
        }

        //Hash the new password and save
        user.hashPassword();
        user.save();

        return res.status(204).send({ message: 'Password changed!' });
    }
}

export default AuthController;
