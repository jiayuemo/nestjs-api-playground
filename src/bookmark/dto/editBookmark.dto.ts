import { IsOptional, IsString, IsUrl } from 'class-validator';

export class EditBookmarkDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  link?: string;
}
