import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './responses/login.response';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

    console.log(user);
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
}
