import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from "typeorm";
import { Necessity } from "./Necessity";

@Entity('Coordinate')
export class Coordinate {

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    latitude: number;

    @Column()
    longitude: number;

    @OneToOne(type => Necessity, necessity => necessity.coordinate)
    necessity: Necessity;
}
