import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity('Necessity')
export class Necessity extends BaseEntity {

    constructor(name: string, mappingName: string = null, type: string, address: string = null, addressNumber: string = null, geolocationAddress: string, phone: string = null, website: string = null, postalCode: string = null, coordinate: { latitude: number, longitude: number }) {
        super();
        this.name = name;
        this.mappingName = mappingName;
        this.type = type;
        this.address = address;
        this.addressNumber = addressNumber;
        this.geolocationAddress = geolocationAddress;
        this.phone = phone;
        this.website = website;
        this.postalCode = postalCode;
        this.coordinate = coordinate;
    }

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
