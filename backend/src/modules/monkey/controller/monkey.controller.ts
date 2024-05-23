import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';

import { MonkeyEntity } from '@entities/monkey.entity';

import { MonkeyService } from '../monkey.service';
import { PaginationOption, PaginationResponse } from '@base/pagination.dto';

import { CreateMonkeyDto } from '../dto/create-monkey.dto';
import { BaseResponseDto } from '@base/base.dto';

import { UpdateMonkeyDto } from '../dto/update-monkey.dto';
import { DeleteResult } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('monkey')
@Controller('monkey')
export class MonkeyController {
    constructor(private readonly monkeyService: MonkeyService) {}

    @Get('/get-all')
    async getAll(@Query() filter: PaginationOption): Promise<PaginationResponse<MonkeyEntity>> {
        const data = await this.monkeyService._paginate(filter.page, filter.limit, { deleted: false });
        return new PaginationResponse<MonkeyEntity>(data.body, data.meta);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/create')
    async create(@Body() createMonkeyDto: CreateMonkeyDto): Promise<BaseResponseDto<MonkeyEntity>> {
        const type = await this.monkeyService.create(createMonkeyDto);
        return new BaseResponseDto<MonkeyEntity>(type);
    }

    @Get('getbyId/:id')
    async getById(@Param('id') id: number): Promise<BaseResponseDto<MonkeyEntity>> {
        console.log('getById CALL', id);
        const data = await this.monkeyService._findById(id);
        return new BaseResponseDto<MonkeyEntity>(data);
    }

    @HttpCode(HttpStatus.OK)
    @Patch('/:id')
    async update(
        @Param('id') id: number,
        @Body() updateMonkeyDto: UpdateMonkeyDto,
    ): Promise<BaseResponseDto<MonkeyEntity>> {
        const updateUser = await this.monkeyService._update(id, updateMonkeyDto);
        return new BaseResponseDto<MonkeyEntity>(updateUser);
    }

    @HttpCode(HttpStatus.OK)
    @Delete('/:id')
    async destroy(@Param('id') id: number): Promise<BaseResponseDto<DeleteResult>> {
        await this.monkeyService._softDelete(id);
        return new BaseResponseDto<DeleteResult>(null);
    }
}
