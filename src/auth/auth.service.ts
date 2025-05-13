import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService, 
        private readonly usersService: UsersService
    ) {}

    async register (dto: CreateUserDto) {
        const newUser = await this.usersService.create(dto);
        
        return this.generateToken(newUser)
    }

    async generateToken (user: any) {
        const payload = {
            sub: user.id,
            email: user.email,
        }

        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}
