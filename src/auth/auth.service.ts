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

    const payload = { id: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
      username: user.username,
      email: user.email,
      id: user.id,
    };
  }
}
