import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginResponse {
  username: string;
  accessToken: string;
}

export class RequestUser {
  userId: number;
  username: string;
}
