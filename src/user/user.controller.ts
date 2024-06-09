/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  LoginUserDto,
  RegisterUserDto,
  RegisterAdminDto,
  UpdateUserBalanceDto,
  SwaggerReponse,
  IsID,
} from './dto/create-user.dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { isMongoId } from 'class-validator';

@ApiTags('Account  APIs')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/admin/register')
  @ApiOperation({
    summary: 'Create New Admin',
    description: 'This endpoint is create a new admin',
  })
  @ApiBody({ type: RegisterAdminDto })
  @ApiOkResponse({ type: SwaggerReponse })
  registerAdmin(@Body() createUserDto: RegisterAdminDto) {
    return this.userService.registerAdmin(createUserDto);
  }

  @Post('/admin/login')
  @ApiOperation({
    summary: 'Login to Admin account',
    description: 'This endpoint is login to an admin account',
  })
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({ type: SwaggerReponse })
  loginAdmin(@Body() createUserDto: LoginUserDto) {
    return this.userService.loginAdmin(createUserDto);
  }

  @Post('/register')
  @ApiOperation({
    summary: 'Create a new User account',
    description: 'This endpoint is register a new user account',
  })
  @ApiBody({ type: RegisterUserDto })
  @ApiOkResponse({ type: SwaggerReponse })
  registerUser(@Body() createUserDto: RegisterUserDto) {
    return this.userService.registerUser(createUserDto);
  }

  @Post('/login')
  @ApiOperation({
    summary: 'Login to User account',
    description: 'This endpoint is login to a user account',
  })
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({ type: SwaggerReponse })
  loginUser(@Body() createUserDto: LoginUserDto) {
    return this.userService.loginUser(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update User Balance',
    description: 'This endpoint is update a users balance',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateUserBalanceDto })
  @ApiOkResponse({ type: SwaggerReponse })
  update(@Param() mongoId: IsID, @Body() body: UpdateUserBalanceDto) {
    const { id } = mongoId;
    return this.userService.update({ id }, body);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Users',
    description: 'This endpoint is get all user accounts',
  })
  @ApiOkResponse({ type: SwaggerReponse })
  findAll() {
    return this.userService.findAll();
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Find User with ID',
    description: 'This endpoint is fetch a user with specified ID',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOkResponse({ type: SwaggerReponse })
  find(@Param() mongoId: IsID) {
    const { id } = mongoId;
    return this.userService.find({ id });
  }
}
