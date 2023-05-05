import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBusinessDto, UpdateBusinessDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBusinessDto) {
    const business = await this.prisma.business.create({
      data: {
        ...dto,
      },
    });

    return business;
  }

  findAll() {
    return `This action returns all businesses`;
  }

  async findOne(uuid: string) {
    const business = await this.prisma.business.findFirst({
      where: {
        uuid: uuid,
        deletedAt: {
          not: null,
        },
      },
    });
    return business;
  }

  async update(uuid: string, dto: UpdateBusinessDto) {
    const business = await this.prisma.business.findFirst({
      where: {
        uuid: uuid,
        deletedAt: {
          not: null,
        },
      },
    });
    if (!business) throw new NotFoundException();

    return this.prisma.business.update({
      where: {
        uuid: uuid,
      },
      data: {
        ...dto,
      },
    });
  }

  async remove(uuid: string) {
    const business = await this.prisma.business.findFirst({
      where: {
        uuid: uuid,
        deletedAt: {
          not: null,
        },
      },
    });
    if (!business) return;

    await this.prisma.business.update({
      where: {
        uuid: uuid,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
