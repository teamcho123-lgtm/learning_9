import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import { isComparePasswordHelper } from '../helper/util.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async validateUser(email: string, password: string,) {
    const user = await this.usersService.findByEmail(email);

    const isPasswordValid = await isComparePasswordHelper(
      password,
      user?.password || '',
    );

    // Kiểm tra user trước
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    return user;
  }

  async login(user: any) {
    const payload = {
      sub: user._id,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret:
        this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),

      expiresIn: Number(
        this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRED',
          '259200',
        ),
      ),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Không tìm thấy refresh token',
      );
    }

    try {
      // verifyAsync tự kiểm tra chữ ký và exp
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret:
          this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });

      const newPayload = {
        sub: payload.sub,
        role: payload.role,
      };

      const accessToken =
        await this.jwtService.signAsync(newPayload);

      return {
        access_token: accessToken,
      };
    } catch (error: any) {
      if (error?.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          code: 'REFRESH_TOKEN_EXPIRED',
          message: 'Refresh token đã hết hạn',
        });
      }

      throw new UnauthorizedException({
        code: 'REFRESH_TOKEN_INVALID',
        message: 'Refresh token không hợp lệ',
      });
    }
  }

  async register(createAuthDto: CreateAuthDto) {
    return await this.usersService.register(createAuthDto);

  }

  async verifyCode(email: string, codeId: string) {
    return await this.usersService.verifyCode(email, codeId);
  }


}
