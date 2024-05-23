import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonkeyEntity } from '@entities/index';

import { MonkeyService } from './monkey.service';
import { MonkeyRepository } from './monkey.repository';
import { MonkeyController } from './controller/monkey.controller';

@Module({
    imports: [TypeOrmModule.forFeature([MonkeyEntity])],
    controllers: [MonkeyController],
    providers: [MonkeyService, MonkeyRepository],
    exports: [MonkeyService],
})
export class MonkeyModule {}
