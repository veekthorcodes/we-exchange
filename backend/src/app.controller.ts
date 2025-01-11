import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LoginDto } from './dtos/auth.dto';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ConvertDto } from './dtos/exchange.dto';

@Controller()
@UseGuards(ThrottlerGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('auth/login')
  async login(@Body() loginDto: LoginDto) {
    return this.appService.login(loginDto);
  }

  @Get('exchange-rates')
  async getExchangeRates() {
    return this.appService.getCurrentRates();
  }

  @Post('convert')
  @UseGuards(JwtAuthGuard)
  async convert(@Body() convertDto: ConvertDto, @Request() req) {
    return this.appService.convert(convertDto, req.user);
  }

  @Get('user/transactions')
  @UseGuards(JwtAuthGuard)
  async getTransactions(@Request() req) {
    return this.appService.getUserTransactions(req.user);
  }
}
