import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class SigninResponseDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  name: string;
}
