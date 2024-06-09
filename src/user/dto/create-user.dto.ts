/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';
export class RegisterAdminDto {
  @ApiProperty({ description: 'User name of the admin' })
  @IsNotEmpty()
  username: string;
  @ApiProperty({ description: 'password of the admin' })
  @IsNotEmpty()
  password: string;
}
export class RegisterUserDto {
  @ApiProperty({ description: 'fullname of the user' })
  @IsNotEmpty()
  fullname: string;
  @ApiProperty({ description: 'Username of the user' })
  @IsNotEmpty()
  username: string;
  @ApiProperty({ description: 'Email of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({ description: 'password of the user' })
  @IsNotEmpty()
  password: string;
  @ApiProperty({ description: 'phone number of the user' })
  @IsNotEmpty()
  phoneNumber: string;
}
export class IsID {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
export class LoginUserDto {
  @ApiProperty({ description: 'Username of the user' })
  @IsNotEmpty()
  username: string;
  @ApiProperty({ description: 'password of the user' })
  @IsNotEmpty()
  password: string;
}
export class UpdateUserBalanceDto {
  @ApiProperty({ description: 'balance of the user' })
  @IsNotEmpty()
  @IsNumber()
  balance: number;
}

export class SwaggerReponse {
  @ApiProperty({ description: 'Message' })
  message: string;

  @ApiProperty({ description: 'Request Status (true or false)' })
  success: boolean;
  @ApiProperty({ description: 'Request Http response code' })
  status: number;

  @ApiProperty({
    description: 'Data object containing the required Information',
  })
  data?: any;
}
