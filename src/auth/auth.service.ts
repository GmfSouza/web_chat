import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dtos/login.dto';
import { compare } from 'bcrypt';

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

    async validateUser (email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) return null;

        const validPassword = await compare(password, user.password);
        if(!validPassword) return null;

        return user;
    }

    async login (dto: LoginDto) {
        const user = await this.validateUser(dto.email, dto.password);
        if (!user) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED)
        }

        return this.generateToken(user)
    }
}
