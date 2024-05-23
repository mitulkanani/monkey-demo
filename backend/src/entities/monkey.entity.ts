import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { DateAudit } from '@base/date_audit.entity';

@Entity({ name: 'monkeys' })
export class MonkeyEntity extends DateAudit {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ name: 'description', type: 'varchar', nullable: false })
    description: string;

    @Column({ name: 'url', type: 'varchar', nullable: false })
    url: string;

    constructor(partial: Partial<MonkeyEntity>) {
        super();
        Object.assign(this, partial);
    }
}
