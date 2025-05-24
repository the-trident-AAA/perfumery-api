import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginResponse } from './responses/login.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Este endpoint agrega una oferta a la base de datos',
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
}
