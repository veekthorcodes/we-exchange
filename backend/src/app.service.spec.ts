import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Transaction } from './entities/transaction.entity';

jest.mock('axios');
jest.mock('bcrypt');
jest.mock('@nestjs/jwt');

describe('AppService', () => {
  let appService: AppService;
  let userRepository: Repository<User>;
  let transactionRepository: Repository<Transaction>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository,
        },
        JwtService,
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    transactionRepository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should successfully log in a user and return an access token', async () => {
      const username = process.env.DEFAULT_USER;
      const password = process.env.DEFAULT_PASSWORD;
      const loginDto = { username, password };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      (bcrypt.compare as jest.Mock).mockImplementation(
        (plainPassword, hashed) => {
          if (plainPassword === password && hashed === 'hashedPassword') {
            return Promise.resolve(true);
          }
          return Promise.resolve(false);
        },
      );

      const user: User = {
        id: 1,
        username,
        password: 'hashedPassword',
        transactions: [],
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue('fake-jwt-token');

      const result = await appService.login(loginDto);

      expect(result).toEqual({ accessToken: 'fake-jwt-token', username });
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          username: user.username,
          sub: user.id,
          timestamp: expect.any(Number),
        }),
      );
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = { username: 'testuser', password: 'wrongpassword' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        id: 1,
        username: 'testuser',
        password: await bcrypt.hash('password123', 10),
        transactions: [],
      });

      await expect(appService.login(loginDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });

  describe('convert', () => {
    it('should convert currency and save transaction', async () => {
      const convertDto = {
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        amount: 100,
      };
      const user: User = {
        id: 1,
        username: 'testuser',
        password: 'testpass',
        transactions: [],
      };
      const rates = { rates: { USD: 1, EUR: 0.9 } };

      jest.spyOn(axios, 'get').mockResolvedValue({ data: rates });
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const mockTransaction: Transaction = {
        id: 1,
        amount: convertDto.amount,
        rate: rates.rates.EUR,
        fromCurrency: convertDto.fromCurrency,
        toCurrency: convertDto.toCurrency,
        convertedAmount: 90,
        timestamp: new Date(),
        user: user,
      };

      jest
        .spyOn(transactionRepository, 'create')
        .mockReturnValue(mockTransaction);
      jest
        .spyOn(transactionRepository, 'save')
        .mockResolvedValue(mockTransaction);

      const result = await appService.convert(convertDto, user);

      expect(result.convertedAmount).toBe(90);
      expect(transactionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fromCurrency: convertDto.fromCurrency,
          toCurrency: convertDto.toCurrency,
          amount: convertDto.amount,
          rate: expect.any(Number),
          user,
        }),
      );
      expect(transactionRepository.save).toHaveBeenCalled();
    });

    it('should throw HttpException for invalid currency', async () => {
      const convertDto = {
        fromCurrency: 'USD',
        toCurrency: 'XYZ',
        amount: 100,
      };
      const user: User = {
        id: 1,
        username: 'testuser',
        password: 'testpass',
        transactions: [],
      };

      jest
        .spyOn(axios, 'get')
        .mockResolvedValue({ data: { rates: { USD: 1 } } });

      await expect(appService.convert(convertDto, user)).rejects.toThrowError(
        HttpException,
      );
    });

    it('should throw HttpException when unable to fetch exchange rates', async () => {
      const convertDto = {
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        amount: 100,
      };
      const user: User = {
        id: 1,
        username: 'testuser',
        password: 'testpass',
        transactions: [],
      };

      jest
        .spyOn(axios, 'get')
        .mockRejectedValue(new Error('Failed to fetch rates'));

      await expect(appService.convert(convertDto, user)).rejects.toThrowError(
        HttpException,
      );
    });
  });
});
