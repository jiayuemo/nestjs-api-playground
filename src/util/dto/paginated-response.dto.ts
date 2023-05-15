import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<TData> {
  @ApiProperty({
    description: 'Total number of items',
  })
  total: number;

  @ApiProperty({
    description: 'The number of items to return per page',
  })
  take: number;

  @ApiProperty({
    description: 'The page number to retrieve',
  })
  page: number;

  results: TData[];
}
