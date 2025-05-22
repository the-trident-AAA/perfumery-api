import {
  Injectable,
  Dependencies,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
@Dependencies(UsersService)
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(dto: RegisterDto) {
    return await this.usersService.create(dto);
  }

  async login(username: string, pass: string) {}
}
