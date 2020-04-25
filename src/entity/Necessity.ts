import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('Necessity')
export class Necessity {

    @PrimaryGeneratedColumn("uuid")
    id: number;
    
    @Column()
    name: string;

    @Column({ nullable: true })
    mappingName: string;

    @Column()
    type: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    addressNumber: string;

    @Column()
    geolocationAddress: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    website: string;

    @Column({ nullable: true })
    postalCode: string;

    @Column('simple-json')
    coordinate: { latitude: number, longitude: number };

}
