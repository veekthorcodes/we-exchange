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
import * as bcrypt from 'bcryptjs';
import { LoginDto, LoginResponse, RequestUser } from './dtos/auth.dto';
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
    await this.createDefaultUsers();
  }

  private async createDefaultUsers() {
    const users = [
      {
        username: 'user 1',
        password: 'password1'
      },
      {
        username: 'user 2',
        password: 'password2'
      }
    ]

    try {
      const existingUsers = await this.userRepository.find({
        where: users.map(user => ({ username: user.username }))
      });

      const existingUsernames = existingUsers.map(user => user.username);

      const newUserPromises = users.filter(user => !existingUsernames.includes(user.username))
        .map(async (user) => {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          const newUser = this.userRepository.create({
            username: user.username,
            password: hashedPassword
          });

          await this.userRepository.save(newUser);
          console.log(`User ${user.username} created successfully`);
        });

      await Promise.all(newUserPromises);

      users.forEach(user => {
        if (existingUsernames.includes(user.username)) {
          console.log(`User ${user.username} already exists`);
        }
      });
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

  async convert(convertDto: ConvertDto, user: RequestUser) {
    const rates = await this.getCurrentRates();

    const fromRate = rates.rates[convertDto.fromCurrency];
    const toRate = rates.rates[convertDto.toCurrency];

    if (!fromRate || !toRate) {
      throw new HttpException('Invalid currency', HttpStatus.BAD_REQUEST);
    }

    const rate = toRate / fromRate;
    const convertedAmount = convertDto.amount * rate;

    const dbUser = await this.userRepository.findOne({
      where: { id: user.userId },
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

  async getUserTransactions(user: RequestUser) {
    return this.transactionRepository.find({
      where: { user: { id: user.userId } },
      order: { timestamp: 'DESC' },
    });
  }
}
