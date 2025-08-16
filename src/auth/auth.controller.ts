import {
  Body,
  Controller,
  Get,
  Param,
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
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guard/roles.guard';
import { Role } from '../common/enums/role.enum';
import { Auth } from './decorators/auth.decorators';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

interface RequestWithUser extends Request {
  user: { user: string; role: string };
}
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

  @Post('change-password-user/:id')
  @ApiOperation({
    summary:
      'Este endpoint se encaraga del proceso de cambio de contraseña de un usuario',
  })
  @ApiResponse({
    status: 201,
    description: 'Cambio de contraseña efectuado con éxito',
  })
  @ApiResponse({
    status: 500,
    description: 'Ocurrió un error en el proceso de cambio de contraseña',
  })
  changePasswordUser(@Param('id') id: string, @Body() dto: ChangePasswordDto) {
    return this.authService.changePasswordUser(id, dto);
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

  @Get('admin-profile')
  @Roles([Role.USER])
  @UseGuards(AuthGuard, RolesGuard)
  profileClient(
    @Request()
    req: RequestWithUser,
  ) {
    return req.user;
  }

  @Get('client-profile')
  @Auth([Role.ADMIN])
  profileAdmin(
    @Request()
    req: RequestWithUser,
  ) {
    return req.user;
  }

  @Post('send-otp')
  @ApiOperation({
    summary: 'Enviar código OTP al email del usuario',
  })
  @ApiResponse({
    status: 201,
    description: 'OTP enviado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Email inválido o usuario no encontrado',
  })
  async sendOTP(@Body() dto: SendOtpDto) {
    return this.authService.sendOTP(dto.userId);
  }

  @Post('verify-otp')
  @ApiOperation({
    summary: 'Verificar código OTP',
  })
  @ApiResponse({
    status: 201,
    description: 'OTP verificado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'OTP inválido o expirado',
  })
  async verifyOTP(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOTP(dto.userId, dto.otp);
  }

  @Post('activate-account')
  @ApiOperation({
    summary: 'Actvivar cuenta de usuario',
  })
  @ApiResponse({
    status: 201,
    description: 'Cuenta activdad correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'OTP de activación inválido o expirado',
  })
  async activateAccount(@Body() dto: VerifyOtpDto) {
    return this.authService.activateAccount(dto.userId, dto.otp);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Resetear contraseña usando OTP',
  })
  @ApiResponse({
    status: 201,
    description: 'Contraseña cambiada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'OTP inválido o usuario no encontrado',
  })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
