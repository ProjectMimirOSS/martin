import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'webhooks' })
export class WebHook {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true })
    url: string;

    @Column({ type: 'bool', default: true })
    active: boolean;

    @CreateDateColumn({ type: "timestamp", nullable: true })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", nullable: true })
    updatedAt: Date;

}