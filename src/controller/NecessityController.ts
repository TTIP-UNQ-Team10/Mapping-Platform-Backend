import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Necessity } from "../entity/Necessity";

export class NecessityController {

    private necessityRepository = getRepository(Necessity);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.necessityRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.necessityRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.necessityRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let necessityToRemove = await this.necessityRepository.findOne(request.params.id);
        await this.necessityRepository.remove(necessityToRemove);
    }

}