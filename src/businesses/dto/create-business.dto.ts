import { IsNotEmpty, IsString, IsLatitude, IsLongitude } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  state: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  country: string;

  @IsLatitude()
  @IsNotEmpty()
  @ApiProperty()
  latitude: number;

  @IsLongitude()
  @IsNotEmpty()
  @ApiProperty()
  longitude: number;
}
