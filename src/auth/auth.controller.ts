import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginResponse } from './responses/login.response';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Este endpoint se encaraga de registrar un usuario como cliente',
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Este endpoint se encaraga de la autenticación',
  })
  @ApiResponse({
    status: 201,
    description: 'Logeo realizado con éxito',
    type: LoginResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de logeo',
  })
  login(@Body() dto: loginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @ApiOperation({
    summary: 'Este endpoint se encarga de la protección de rutas',
  })
  @UseGuards(AuthGuard)
  profile(@Request() req) {
    return req.user;
  }
}
