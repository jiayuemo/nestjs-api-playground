import { ApiProperty } from '@nestjs/swagger';

export class BusinessResponseDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  latitude: string;

  @ApiProperty()
  longitude: string;
}
