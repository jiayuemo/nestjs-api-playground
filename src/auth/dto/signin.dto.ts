import { PickType } from '@nestjs/swagger';
import { SignupDto } from './signup.dto';

export class SigninDto extends PickType(SignupDto, [
  'email',
  'password',
] as const) {}
