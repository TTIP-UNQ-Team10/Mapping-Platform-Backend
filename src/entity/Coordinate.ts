import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { Necessity } from "./Necessity";

@Entity('Coordinate')
export class Coordinate {

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    latitude: number;

    @Column()
    longitude: number;

    @ManyToOne(type => Necessity, necessity => necessity.coordinates)
    necessity: Necessity;
}
