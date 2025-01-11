import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';

jest.mock('bcrypt');
jest.mock('@nestjs/jwt');

describe('AppService', () => {
  let appService: AppService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        JwtService,
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
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
});
