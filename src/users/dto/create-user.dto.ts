import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRolesEnum } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({required: true, type: String, enum: UserRolesEnum, default: UserRolesEnum.USER})
    @IsNotEmpty()
    @IsOptional()
    role: UserRolesEnum;
}
