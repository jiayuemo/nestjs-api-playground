import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  LoggerService,
  Logger,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import {
  BusinessResponseDto,
  CreateBusinessDto,
  UpdateBusinessDto,
} from './dto';
import { PaginatedRequestDto, PaginatedResponseDto } from 'src/util/dto';
import { JwtGuard } from 'src/auth/guard';
import { ApiOkPaginatedResponse } from 'src/util/decorator';
import { GetUser } from 'src/auth/decorator';

@ApiTags('businesses')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiExtraModels(PaginatedResponseDto)
@UseGuards(JwtGuard)
@Controller('businesses')
export class BusinessesController {
  private readonly logger: LoggerService;
  constructor(private readonly businessesService: BusinessesService) {
    this.logger = new Logger(BusinessesService.name);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The resource has been successfully created.',
    type: BusinessResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  create(
    @GetUser('uuid') userUuid: string,
    @Body() createBusinessDto: CreateBusinessDto,
  ) {
    this.logger.log(`User: ${userUuid}, Created Business.`);
    return this.businessesService.create(userUuid, createBusinessDto);
  }

  @Get()
  @ApiOkPaginatedResponse(BusinessResponseDto)
  findAllPaginated(@Query() paginatedRequestDto: PaginatedRequestDto) {
    this.logger.log(`GET paginated business resources`);
    return this.businessesService.findAllPaginated(paginatedRequestDto);
  }

  @Get(':uuid')
  @ApiOkResponse({
    description: 'Retrieves a resource.',
    type: BusinessResponseDto,
  })
  findOne(@Param('uuid') uuid: string) {
    this.logger.log(`GET business resource`);
    return this.businessesService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOkResponse({
    description: 'Updates a resource.',
    type: BusinessResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    this.logger.log(`PATCH business resource`);
    return this.businessesService.update(uuid, updateBusinessDto);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Soft deletes a resource.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  remove(@Param('uuid') uuid: string) {
    this.logger.log(`DELETE business resource`);
    return this.businessesService.remove(uuid);
  }
}
