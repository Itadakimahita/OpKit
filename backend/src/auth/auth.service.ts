// src/auth/auth.service.ts
import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { User } from '@prisma/client';
import { JwtPayload } from '../common/types/jwt-payload.type.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<Omit<User, 'password'>> {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
        },
      });

      return this.omitPassword(user);
    } catch (error: unknown) {
      this.handlePrismaError(error);
    }
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    try {
      const user = await this.validateUser(dto.email, dto.password);
      const payload: JwtPayload = { sub: user.id, email: user.email };

      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    } catch (error: unknown) {
      this.handlePrismaError(error);
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      return user;
    } catch (error: unknown) {
      this.handlePrismaError(error);
    }
  }

  private omitPassword(user: User): Omit<User, 'password'> {
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof HttpException) {
      throw error;
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Email already exists');
    }

    throw new InternalServerErrorException('Authentication request failed');
  }
}
