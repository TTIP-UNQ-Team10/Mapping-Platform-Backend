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
            return res.status(400).send({ message: 'email and password are required'});
        }

        let user: User;

        try {
            user = await User.findOne({ email: email });
        } catch (error) {
            return res.status(401).send({ message: 'requested user does not exist'});
          }

        //Check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).send({ message: 'password does not match'});
            return;
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
            return res.status(400).send({ message: 'old password and new password are required' });
        }

        let user: User;
        try {
            user = await User.findOne({ id: id })
        } catch (id) {
            return res.status(401).send({ message: 'user not found' });
        }

        //Check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            res.status(401).send({ message: 'old password is not valid' });
            return;
        }

        user.password = newPassword;
        const errors = await validate(user);

        if (errors.length > 0) {
            return res.status(400).send(errors);
        }

        //Hash the new password and save
        user.hashPassword();
        user.save();

        return res.status(204).send({ message: 'password changed!' });
    }
}

export default AuthController;
