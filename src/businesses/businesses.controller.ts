import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import {
  BusinessResponseDto,
  CreateBusinessDto,
  UpdateBusinessDto,
} from './dto';
import { PaginatedRequestDto, PaginatedResponseDto } from 'src/util/dto';
import { ApiOkPaginatedResponse } from 'src/util/decorator';

@ApiTags('core')
@ApiBearerAuth()
@ApiExtraModels(PaginatedResponseDto)
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The resource has been successfully created.',
    type: BusinessResponseDto,
  })
  @ApiOkResponse({ description: 'The exact same resource already exists.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessesService.create(createBusinessDto);
  }

  @Get()
  @ApiOkPaginatedResponse(BusinessResponseDto)
  findAllPaginated(@Query() paginatedRequestDto: PaginatedRequestDto) {
    const { take, page } = paginatedRequestDto;
    const skip = (page - 1) * take;
    return this.businessesService.findAllPaginated(skip, take);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessesService.findOne(+id);
  }

  @Patch(':id')
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return this.businessesService.update(+id, updateBusinessDto);
  }

  @Delete(':id')
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.businessesService.remove(+id);
  }
}
