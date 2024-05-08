import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';
import * as ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    const isValid = await this.usersService.isValidPassword(
      pass,
      user.password,
    );
    if (user && isValid == true) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, name, email } = user;
    const payload = {
      sub: 'Token login',
      iss: 'Form sever',
      _id,
      name,
      email,
    };

    const refresh_token = this.createRefreshToken(payload);
    await this.usersService.updateUserToken(refresh_token, _id);

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge:
        ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email,
      },
    };
  }

  createRefreshToken = (payload: any) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'),
    });
    return refreshToken;
  };

  processNewToken = async (refreshToken: string, response: Response) => {
    try {
        this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      
      let user = await this.usersService.findUserByToken(refreshToken);
      if (user) {
        const { _id, name, email } = user;
        const payload = {
          sub: 'token login',
          iss: 'from sever',
          _id,
          name,
          email,
        };
        const refresh_token = await this.createRefreshToken(payload);
        await this.usersService.updateUserToken(refresh_token, _id);

        response.clearCookie('refresh_token');

        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge:
            ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')),
        });

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            name,
            email,
          },
        };
      } else {
        throw new BadRequestException(
          'Refresh token không hợp lệ. Vui long login.',
        );
      }
    } catch (e) {
      throw new BadRequestException(
        'Refresh token không hợp lệ. Vui long login.',
      );
    }
  };

  logout = async (response: Response, user: IUser) =>{
    await this.usersService.updateUserToken("", user._id)
    response.clearCookie("refresh_token");
    return "ok";
} 
}
