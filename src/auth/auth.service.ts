import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import { isComparePasswordHelper } from '../helper/util.js';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
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
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }


}
