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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
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
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The resource has been successfully created.',
    type: BusinessResponseDto,
  })
  @ApiOkResponse({
    description: 'The exact same resource already exists.',
    type: BusinessResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  create(
    @GetUser('uuid') userUuid: string,
    @Body() createBusinessDto: CreateBusinessDto,
  ) {
    return this.businessesService.create(userUuid, createBusinessDto);
  }

  @Get()
  @ApiOkPaginatedResponse(BusinessResponseDto)
  findAllPaginated(@Query() paginatedRequestDto: PaginatedRequestDto) {
    const { take, page } = paginatedRequestDto;
    const skip = (page - 1) * take;
    return this.businessesService.findAllPaginated(skip, take);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.businessesService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return this.businessesService.update(uuid, updateBusinessDto);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  remove(@Param('uuid') uuid: string) {
    return this.businessesService.remove(uuid);
  }
}
