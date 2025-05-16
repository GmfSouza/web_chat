import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';

@Controller()
export class AuthController {
    constructor (private readonly authService: AuthService) {}

    @Post('register')
    public async register(@Body() dto: CreateUserDto) {
        const user = await this.authService.register(dto);
        return {
            message: 'User created successfully',
            user
        }
    }

    @Post('login') 
    public async login(@Body() dto: LoginDto) {
        const token = await this.authService.login(dto);
        return {
            message: 'Login successful',
            token
        }
    }
}
