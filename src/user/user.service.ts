/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  LoginUserDto,
  RegisterAdminDto,
  RegisterUserDto,
} from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Admin, Prisma, User } from '@prisma/client';
import { handleError, handleResponse } from 'src/common/helpers';
// import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    // private jwtService: JwtService,
  ) {}

  async registerAdmin(data: RegisterAdminDto) {
    try {
      let admin = await this.getAdmin({ username: data.username });
      if (admin) {
        return handleError(
          `Admin with username already registered, kindly proceed to login`,
          null,
          HttpStatus.BAD_REQUEST,
        );
      }

      const salt = 10;
      const hashedPassword = await bcrypt.hash(data.password, salt);
      admin = await this.prisma.admin.create({
        data: {
          username: data.username,
          password: hashedPassword,
        },
      });
      delete admin.password;
      // const token = this.jwtService.sign(admin);
      const res = {
        ...admin,
        // token,
      };
      return handleResponse(res, 'Admin Created Successfully', HttpStatus.OK);
    } catch (error) {
      return handleError(
        `Something went wrong: ${error.message}`,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async registerUser(data: RegisterUserDto) {
    try {
      let user = await this.getUser({ email: data.email });
      if (user) {
        return handleError(
          `user with email already registered, kindly proceed to login`,
          null,
          HttpStatus.BAD_REQUEST,
        );
      }
      user = await this.getUser({ username: data.username });
      if (user) {
        return handleError(
          `user with username already registered, kindly proceed to login`,
          null,
          HttpStatus.BAD_REQUEST,
        );
      }

      const salt = 10;
      const hashedPassword = await bcrypt.hash(data.password, salt);
      user = await this.prisma.user.create({
        data: {
          fullname: data.fullname,
          username: data.username,
          email: data.email,
          password: hashedPassword,
          phoneNumber: data.phoneNumber,
        },
      });
      delete user.password;
      // const token = this.jwtService.sign(user);
      const res = {
        ...user,
        // token,
      };
      return handleResponse(res, 'User Created Successfully', HttpStatus.OK);
    } catch (error) {
      return handleError(
        `Something went wrong: ${error.message}`,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async loginAdmin(data: LoginUserDto) {
    try {
      const admin = await this.getAdmin({ username: data.username });
      if (!admin) {
        return handleError(
          `Admin with email not registered, kindly proceed to register`,
          null,
          HttpStatus.BAD_REQUEST,
        );
      }
      const isMatch = await bcrypt.compare(data.password, admin.password);
      if (!isMatch)
        throw new HttpException('password incorrect', HttpStatus.BAD_REQUEST);
      delete admin.password;
      // const token = this.jwtService.sign(admin);
      const res = {
        ...admin,
        // token,
      };
      return handleResponse(res, 'Admin login Successful', HttpStatus.OK);
    } catch (error) {
      return handleError(
        `Something went wrong: ${error.message}`,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async loginUser(data: LoginUserDto) {
    try {
      const user = await this.getUser({ username: data.username });
      if (!user) {
        return handleError(
          `user with username not registered, kindly proceed to register`,
          null,
          HttpStatus.BAD_REQUEST,
        );
      }
      const isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch)
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      delete user.password;
      // const token = this.jwtService.sign(user);
      const res = {
        ...user,
        // token,
      };
      return handleResponse(res, 'User login Successful', HttpStatus.OK);
    } catch (error) {
      return handleError(
        `Something went wrong: ${error.message}`,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<any> {
    try {
      const user = await this.getUser({ id: where.id });
      if (!user) {
        return handleError(
          `user with username not registered, kindly proceed to register`,
          null,
          HttpStatus.BAD_REQUEST,
        );
      }
      const users = await this.prisma.user.update({
        where,
        data,
      });
      return handleResponse(users, 'User updated Successfully', HttpStatus.OK);
    } catch (error) {
      return handleError(
        `Something went wrong: ${error.message}`,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<any> {
    const users = await this.prisma.user.findMany();
    return handleResponse(users, 'Users fetched Successfully', HttpStatus.OK);
  }

  async find(where: Prisma.UserWhereUniqueInput): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where,
      });
      if (!user) {
        return handleError(
          `user with username not registered, kindly proceed to register`,
          null,
          HttpStatus.BAD_REQUEST,
        );
      }
      return handleResponse(user, 'User fetched Successfully', HttpStatus.OK);
    } catch (error) {
      return handleError(
        `Something went wrong: ${error.message}`,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async getAdmin(
    userWhereUniqueInput: Prisma.AdminWhereUniqueInput,
  ): Promise<Admin | null> {
    return this.prisma.admin.findUnique({
      where: userWhereUniqueInput,
    });
  }
  async getUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }
}
