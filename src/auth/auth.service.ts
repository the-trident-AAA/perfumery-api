import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './responses/login.response';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OtpService } from 'src/otp/otp.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.findOneByUsername(dto.username);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    //Encrypt password
    dto.password = await bcrypt.hash(dto.password, 10);

    return await this.usersService.create(dto);
  }

  async login(dto: loginDto): Promise<LoginResponse> {
    const user = await this.usersService.findOneByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedException('Incorrect username or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect username or password');
    }

    if (!user.isActive) {
      // send the otp for user
      await this.sendOTP(user.email);

      throw new HttpException(
        'La cuenta del usuario necesita ser activada',
        HttpStatus.FORBIDDEN,
      );
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      shopCartId: user.shopCartId,
    };
    const token = await this.jwtService.signAsync(payload);

    return new LoginResponse(
      token,
      user.id,
      user.username,
      user.email,
      user.shopCartId,
    );
  }

  async changePasswordUser(id: string, changePasswordDto: ChangePasswordDto) {
    const userEntity = await this.usersService.findOneEntity(id);

    if (!userEntity)
      throw new BadRequestException(
        'No existe un usuario con ese identificador',
      );

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      userEntity.password,
    );
    if (!isPasswordValid)
      throw new BadRequestException(
        'La contraseña actual proporcionada es incorrecta',
      );

    return await this.usersService.changePasswordUser(
      id,
      await bcrypt.hash(changePasswordDto.newPassword, 10),
    );
  }

  async sendOTP(email: string) {
    // Verificar que el usuario existe
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('No existe un usuario con este email');
    }

    const otp = this.otpService.generateOTP();
    await this.mailService.sendOTPEmail(email, otp);

    // Guardar OTP en base de datos con expiración
    await this.otpService.saveOTP(email, otp);

    return { message: 'OTP enviado correctamente' };
  }

  async verifyOTP(email: string, otp: string) {
    const isValid = await this.otpService.verifyOTP(email, otp);

    if (isValid) {
      return { valid: true, message: 'OTP válido' };
    }
    return { valid: false, message: 'OTP inválido o expirado' };
  }

  async activateAccount(email: string, otp: string) {
    const otpResponde = await this.verifyOTP(email, otp);

    if (!otpResponde.valid)
      throw new BadRequestException('El código otp es incorrecto');

    await this.usersService.activateAccount(email);
    return { valid: true, message: 'Cuenta activada con éxito' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    // Verificar que el usuario existe
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('No existe un usuario con este email');
    }

    // Verificar el OTP
    const isValidOTP = await this.otpService.verifyOTP(dto.email, dto.otp);
    if (!isValidOTP) {
      throw new BadRequestException('OTP inválido o expirado');
    }

    // Cambiar la contraseña
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.changePasswordUser(user.id, hashedPassword);

    return { message: 'Contraseña cambiada exitosamente' };
  }
}
