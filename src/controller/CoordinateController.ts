import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Coordinate } from "../entity/Coordinate";

export class CoordinateController {

    private coordinateRepository = getRepository(Coordinate);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.coordinateRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.coordinateRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.coordinateRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let coordinateToRemove = await this.coordinateRepository.findOne(request.params.id);
        await this.coordinateRepository.remove(coordinateToRemove);
    }

}