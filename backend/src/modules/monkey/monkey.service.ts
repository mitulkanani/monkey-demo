import { Injectable } from '@nestjs/common';
import { EntityId } from 'typeorm/repository/EntityId';

import { BaseService } from '@base/base.service';
import { MonkeyEntity } from '@entities/monkey.entity';

import { MonkeyRepository } from './monkey.repository';
import { CreateMonkeyDto } from './dto/create-monkey.dto';

@Injectable()
export class MonkeyService extends BaseService<MonkeyEntity, MonkeyRepository> {
    constructor(repository: MonkeyRepository) {
        super(repository);
    }

    findById(id: EntityId): Promise<MonkeyEntity> {
        return this._findById(id);
    }

    async create(createMonkeyDto: CreateMonkeyDto): Promise<MonkeyEntity> {
        return await this._store(createMonkeyDto);
    }
}
