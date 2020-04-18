import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn} from "typeorm";
import { Coordinate } from "./Coordinate";

@Entity('Necessity')
export class Necessity {

    @PrimaryGeneratedColumn("uuid")
    id: number;
    
    @Column()
    name: string;

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

    @Column({ nullable: true })
    website: string;

    @Column()
    postalCode: string;

    @OneToOne( type => Coordinate, coordinate => coordinate.necessity, { eager: true })
    @JoinColumn()
    coordinate: Coordinate;

}
