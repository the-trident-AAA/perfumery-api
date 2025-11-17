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
import { ShopCartService } from 'src/shop-cart/shop-cart.service';
import { OauthService } from 'src/oauth/oauth.service';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly shopCartService: ShopCartService,
    private readonly oauthService: OauthService,
  ) {}

  async register(dto: RegisterDto) {
    const userByUserName = await this.usersService.findOneByUsername(
      dto.username,
    );
    if (userByUserName) {
      throw new BadRequestException('Ese nombre de usuario ya está tomado');
    }

    const userByEmail = await this.usersService.findOneByEmail(dto.email);

    if (userByEmail) {
      throw new BadRequestException(
        'El email proporcionado ya tiene una cuenta asociada',
      );
    }

    //Encrypt password
    dto.password = await bcrypt.hash(dto.password, 10);

    return await this.usersService.create(dto);
  }

  async loginWithGoogle(idToken: string, sessionId?: string) {
    const googleUserPayload = await this.oauthService.getGoogleIdToken(idToken);
    console.log(googleUserPayload);
    // chequear si el usuario existe en la bd
    let user = await this.usersService.findOneByUsername(
      googleUserPayload.email,
    );
    console.log(user);
    // si no existe creamos al usuario
    if (!user) {
      user = await this.usersService.create(
        {
          email: googleUserPayload.email,
          username: googleUserPayload.name,
          avatar: googleUserPayload.picture,
          role: Role.USER,
        },
        true,
      );
    }

    return await this.login(
      {
        username: user.email,
        sessionId: sessionId,
      },
      true,
    );
  }

  async login(
    dto: loginDto,
    withGoogle: boolean = false,
  ): Promise<LoginResponse> {
    const user = await this.usersService.findOneByUsername(dto.username);
    if (!user) {
      throw new BadRequestException('Credenciales incorrectas');
    }
    if (!withGoogle) {
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Credenciales incorrectas');
      }
    }

    if (!user.isActive) {
      throw new HttpException(
        {
          message: 'La cuenta del usuario necesita ser activada',
          userId: user.id,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // fusion the shopcarts if sessionId exist
    if (dto.sessionId) {
      await this.shopCartService.fusionShopCart(dto.sessionId, user.shopCartId);
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
      user.role,
    );
  }

  async verifyStateAccount(dto: loginDto) {
    const user = await this.usersService.findOneByUsername(dto.username);
    if (!user) {
      throw new BadRequestException('Credenciales incorrectas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Credenciales incorrectas');
    }

    if (!user.isActive) {
      throw new HttpException(
        {
          message: 'La cuenta del usuario necesita ser activada',
          userId: user.id,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return { valid: true, message: 'Cuenta activada' };
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

  async sendOTP(userId: string) {
    // Verificar que el usuario existe
    const user = await this.usersService.findOneEntity(userId);
    if (!user) {
      throw new BadRequestException('No existe un usuario con este email');
    }

    const otp = this.otpService.generateOTP();
    await this.mailService.sendOTPEmail(user.email, otp);

    // Guardar OTP en base de datos con expiración
    await this.otpService.saveOTP(userId, otp);

    return { message: 'OTP enviado correctamente' };
  }

  async verifyOTP(userId: string, otp: string) {
    const isValid = await this.otpService.verifyOTP(userId, otp);

    if (!isValid) {
      throw new BadRequestException('OTP inválido o expirado');
    }
    return { valid: true, message: 'Verificación exitosa' };
  }

  async checkOtp(userId: string, otp: string) {
    const isValid = await this.otpService.checkOtp(userId, otp);

    if (!isValid.valid) {
      throw new BadRequestException('OTP inválido o expirado');
    }
    return { valid: true, message: 'Verificación exitosa' };
  }

  async activateAccount(userId: string, otp: string) {
    const otpResponde = await this.verifyOTP(userId, otp);

    if (!otpResponde.valid)
      throw new BadRequestException('El código otp es incorrecto');

    await this.usersService.activateAccount(userId);
    return { valid: true, message: 'Cuenta activada con éxito' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    // Verificar que el usuario existe
    const user = await this.usersService.findOneEntity(dto.userId);
    if (!user) {
      throw new BadRequestException('No existe un usuario con este email');
    }

    // Verificar el OTP
    const isValidOTP = await this.otpService.verifyOTP(dto.userId, dto.otp);
    if (!isValidOTP) {
      throw new BadRequestException('OTP inválido o expirado');
    }

    // Cambiar la contraseña
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.changePasswordUser(user.id, hashedPassword);

    return { message: 'Contraseña cambiada exitosamente' };
  }

  async createNewPassordUser(id: string, newPassword: string) {
    return await this.usersService.createNewPasswordUser(id, newPassword);
  }

  async verifyEmail(email: string) {
    const userByEmail = await this.usersService.findOneByEmail(email);

    if (!userByEmail)
      throw new BadRequestException(
        'El correo proporcionado no tiene ninguna cuenta asociada',
      );

    return { userId: userByEmail.id };
  }
}
