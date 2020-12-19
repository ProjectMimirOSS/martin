import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ServiceDowntime extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: 'service_id' })
    serviceId: string;

    @Column({ name: 'sub_service' })
    subService: string;


    @Column({ name: 'down_at', type: 'timestamptz', nullable: true, default: null })
    downAt: Date;

    @Column({ name: 'up_at', type: 'timestamptz', nullable: true, default: null })
    upAt: Date;

    @CreateDateColumn({ type: "timestamp", nullable: true })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", nullable: true })
    updatedAt: Date;

}