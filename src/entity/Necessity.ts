import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Coordinate } from "./Coordinate";

@Entity('Necessity')
export class Necessity {

    @PrimaryGeneratedColumn("uuid")
    id: number;
    
    @Column()
    name: number;

    @Column()
    mappingName: string;

    @Column()
    type: string;

    @Column()
    address: string;

    @Column()
    addressNumber: string;

    @Column()
    geolocationAddress: string;

    @Column()
    phone: string;

    @Column()
    website: string;

    @Column()
    postalCode: string;

    @OneToMany( type => Coordinate , coordinate => coordinate.necessity)
    coordinates: Coordinate[];

}
