import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { MonkeyEntity } from '@entities/monkey.entity';

@Injectable()
export class MonkeyRepository extends Repository<MonkeyEntity> {
    constructor(
        private readonly dataSource: DataSource,
        manager?: EntityManager,
    ) {
        let sManager: EntityManager;
        let sQueryRunner: QueryRunner;
        if (manager && manager != undefined && manager != null) {
            sQueryRunner = manager.queryRunner;
            sManager = manager;
        } else {
            sManager = dataSource?.createEntityManager();
            sQueryRunner = dataSource?.createQueryRunner();
        }
        super(MonkeyEntity, sManager, sQueryRunner);
    }
}
