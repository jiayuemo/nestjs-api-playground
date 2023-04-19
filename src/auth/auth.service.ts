import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // generate password hash
    const hash = await argon.hash(dto.password);
    // save the new user in the database
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
        },
      });
      // return the saved user
      return {
        id: user.id,
        createdAt: user.createdAt,
        email: user.email,
      };
    } catch (error) {
      if (error.code && error.code === 'P2002') {
        throw new ForbiddenException('Credentials taken');
      } else {
        throw new Error(error.message);
      }
    }
  }

  async signin(dto: AuthDto) {
    // find the user via email
    // if user d/n exist throw exception
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials Incorrect');
    // compare password
    // if password incorrect throw exception
    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials Incorrect');
    // send back user
    return {
      id: user.id,
      createdAt: user.createdAt,
      email: user.email,
    };
  }
}
