import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LoginDto } from './dtos/auth.dto';

@Controller()
@UseGuards(ThrottlerGuard)
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('auth/login')
  async login(@Body() loginDto: LoginDto) {
    return this.appService.login(loginDto);
  }
}
