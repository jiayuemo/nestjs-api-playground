import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBusinessDto, UpdateBusinessDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Business } from '@prisma/client';

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a resource
   * An idempotency guard check returns the resource if it already exists
   * Resource is considered the same if every field in the dto exactly matches an entity
   * @param {CreateBusinessDto} dto
   * @returns {Promise<Business>}
   */
  async create(dto: CreateBusinessDto): Promise<Business> {
    const existingBusiness = await this.prisma.business.findFirst({
      where: {
        ...dto,
        deletedAt: {
          not: null,
        },
      },
    });
    if (existingBusiness) return existingBusiness;
    const newBusiness = await this.prisma.business.create({
      data: {
        ...dto,
      },
    });
    return newBusiness;
  }

  /**
   * Finds all resources using offset pagination
   * Will not include soft deleted resources
   * @param {number} skip - the number of resources to skip over
   * @param {number} take - the number of resources to return
   * @returns {Promise<Business[]>}
   */
  async findAllPaginated(skip: number, take: number): Promise<Business[]> {
    const businesses = await this.prisma.business.findMany({
      skip: skip,
      take: take,
      where: {
        deletedAt: {
          not: null,
        },
      },
    });
    return businesses;
  }

  /**
   * Finds a resource identified by uuid
   * Will not return soft deleted resource
   * @param {string} uuid
   * @returns {Promise<Business>}
   * @throws {NotFoundException}
   */
  async findOne(uuid: string): Promise<Business> {
    const business = await this.prisma.business.findFirst({
      where: {
        uuid: uuid,
        deletedAt: {
          not: null,
        },
      },
    });
    if (!business) throw new NotFoundException();
    return business;
  }

  /**
   * Updates a resource identified by uuid
   * Will not update soft deleted resource
   * @param {string} uuid
   * @param {UpdateBusinessDto} dto
   * @returns {Promise<Business>}
   * @throws {NotFoundException}
   */
  async update(uuid: string, dto: UpdateBusinessDto): Promise<Business> {
    const business = await this.prisma.business.findFirst({
      where: {
        uuid: uuid,
        deletedAt: {
          not: null,
        },
      },
    });
    if (!business) throw new NotFoundException();
    const updatedBusiness = this.prisma.business.update({
      where: {
        uuid: uuid,
      },
      data: {
        ...dto,
      },
    });
    return updatedBusiness;
  }

  /**
   * Soft deletes a resource identified by uuid
   * Idempotent deletes, first soft deletion timestamp is preserved
   * @param {string} uuid
   * @returns {void}
   */
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
