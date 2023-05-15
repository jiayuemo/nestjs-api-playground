import {
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { CreateBusinessDto, UpdateBusinessDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Business } from '@prisma/client';
import { PaginatedRequestDto, PaginatedResponseDto } from 'src/util/dto';

@Injectable()
export class BusinessesService {
  private readonly logger: LoggerService;
  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger(BusinessesService.name);
  }

  /**
   * Creates a resource
   * An idempotency guard check returns the resource if it already exists
   * Resource is considered the same if every field in the dto exactly matches an entity
   * @param {string} userUuid
   * @param {CreateBusinessDto} dto
   * @returns {Promise<Business>}
   */
  async create(userUuid: string, dto: CreateBusinessDto): Promise<Business> {
    const existingBusiness = await this.prisma.business.findFirst({
      where: {
        ...dto,
        ownerUuid: userUuid,
        deletedAt: null,
      },
    });
    if (existingBusiness) return existingBusiness;
    const newBusiness = await this.prisma.business.create({
      data: {
        ownerUuid: userUuid,
        ...dto,
      },
    });
    return newBusiness;
  }

  /**
   * Finds all resources using offset pagination
   * Will not include soft deleted resources
   * @param {PaginatedRequestDto} paginatedRequestDto
   * @returns {Promise<PaginatedResponseDto<Business>>}
   */
  async findAllPaginated(
    paginatedRequestDto: PaginatedRequestDto,
  ): Promise<PaginatedResponseDto<Business>> {
    const { take, page } = paginatedRequestDto;
    const skip = (page - 1) * take;
    const where = {
      deletedAt: null,
    };

    const [businessesCount, data] = await this.prisma.$transaction([
      this.prisma.business.count({
        where,
      }),
      this.prisma.business.findMany({
        skip: skip,
        take: take,
        where,
      }),
    ]);

    return {
      total: businessesCount,
      take: take,
      page: page,
      results: data,
    };
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
        deletedAt: null,
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
        deletedAt: null,
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
        deletedAt: null,
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
