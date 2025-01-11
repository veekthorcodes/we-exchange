import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const { timestamp } = payload;
    const expirationTime = process.env.JWT_EXPIRATION_TIME;
    const currentTime = Date.now();

    if (currentTime - timestamp > +expirationTime) {
      throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);
    }
    return { userId: payload.sub, username: payload.username };
  }
}
