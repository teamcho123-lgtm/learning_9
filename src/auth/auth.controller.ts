import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './passport/local-auth.guard.js';
import { JwtAuthGuard } from './passport/jwt-auth.guard.js';
import { Public } from './decorators/public.decorator.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  handleLogin(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Public()
  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {

    return this.authService.register(createAuthDto);
  }

  @Public()
  @Post('verify')
  verify(@Body() body: { email: string; codeId: string }) {
    return this.authService.verifyCode(body.email, body.codeId);
  }
}