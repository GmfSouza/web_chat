import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Controller()
export class AuthController {
    constructor (private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        const user = await this.authService.register(dto);
        return {
            message: 'User created successfully',
            user
        }
    }
}
