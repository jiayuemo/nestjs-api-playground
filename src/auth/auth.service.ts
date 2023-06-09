import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    // generate password hash
    const hash = await argon.hash(dto.password);
    // save the new user in the database
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          hash: hash,
        },
      });
      // send back the jwt related to the user
      return this.signToken(user.uuid, user.email);
    } catch (error) {
      if (error.code && error.code === 'P2002') {
        throw new ForbiddenException('Credentials taken');
      } else {
        throw new Error(error.message);
      }
    }
  }

  async signin(dto: SigninDto) {
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
    // send back the jwt related to the user
    return this.signToken(user.uuid, user.email);
  }

  async signToken(
    userUuid: string,
    email: string,
  ): Promise<{
    access_token: string;
    status: string;
  }> {
    const payload = {
      sub: userUuid,
      email: email,
    };

    const jwtSecret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: jwtSecret,
    });

    return {
      access_token: token,
      status: 'logged_in',
    };
  }
}
