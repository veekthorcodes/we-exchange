import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, LoginResponse } from './dtos/auth.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}
