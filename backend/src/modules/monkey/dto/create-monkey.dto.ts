import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateMonkeyDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'description is not empty' })
    @IsString({ message: 'description must be a string' })
    @MinLength(1, { message: 'description should not be empty' })
    description: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'url is not empty' })
    @IsString({ message: 'url must be a string' })
    @MinLength(1, { message: 'url should not be empty' })
    url: string;
}
