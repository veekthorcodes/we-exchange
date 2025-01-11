import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, LoginResponse } from './dtos/auth.dto';
import axios from 'axios';
import { Transaction } from './entities/transaction.entity';
import { ConvertDto } from './dtos/exchange.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly jwtService: JwtService,
  ) { }

  async onModuleInit() {
    await this.createDefaultUser();
  }

  private async createDefaultUser() {
    const username = process.env.DEFAULT_USER || 'defaultuser';
    const password = process.env.DEFAULT_PASSWORD || 'defaultpassword';

    try {
      const existingUser = await this.userRepository.findOne({
        where: { username: username },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const defaultUser = this.userRepository.create({
          username,
          password: hashedPassword,
        });

        await this.userRepository.save(defaultUser);
        console.log('Default user created successfully');
      } else {
        console.log(
          'Login with default user: ',
          username,
          ' and passowrd: ',
          password,
        );
      }
    } catch (error) {
      console.error('Error creating default user:', error);
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const timestamp = Date.now();
    const payload = { username: user.username, sub: user.id, timestamp };
    return {
      username: user.username,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async getCurrentRates() {
    const supportedCurrencies = 'GHS,NGN,GBP,EUR';
    try {
      const response = await axios.get(
        `https://open.exchangerate-api.com/v6/latest?app_id=${process.env.EXCHANGE_APP_ID}&symbols=${supportedCurrencies}`,
      );
      return response.data;
    } catch (e) {
      throw new HttpException(
        `Failed to fetch exchange rates:, ${e}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async convert(convertDto: ConvertDto, user: User) {
    const rates = await this.getCurrentRates();

    const fromRate = rates.rates[convertDto.fromCurrency];
    const toRate = rates.rates[convertDto.toCurrency];

    if (!fromRate || !toRate) {
      throw new HttpException('Invalid currency', HttpStatus.BAD_REQUEST);
    }

    const rate = toRate / fromRate;
    const convertedAmount = convertDto.amount * rate;

    const dbUser = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!dbUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const transaction = this.transactionRepository.create({
      fromCurrency: convertDto.fromCurrency,
      toCurrency: convertDto.toCurrency,
      amount: convertDto.amount,
      convertedAmount,
      rate,
      user: dbUser,
    });

    await this.transactionRepository.save(transaction);

    return {
      amount: convertDto.amount,
      convertedAmount,
      rate,
      fromCurrency: convertDto.fromCurrency,
      toCurrency: convertDto.toCurrency,
    };
  }
}
