import { Body, Controller, Post, UseGuards, Request, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { BlackListService } from './blacklist.service';

@Controller()
export class AuthController {
    constructor (
        private readonly authService: AuthService,
        private readonly blacklistService: BlackListService,
    ) {}

    @Post('register')
    public async register(@Body() dto: CreateUserDto) {
        const user = await this.authService.register(dto);
        return {
            message: 'User created successfully',
            user
        }
    }

    @HttpCode(200)
    @Post('login') 
    public async login(@Body() dto: LoginDto) {
        const token = await this.authService.login(dto);
        return {
            message: 'Login successful',
            token
        }
    }
    @HttpCode(200)
    @Post('logout')
    @UseGuards(JwtAuthGuard)
    public async logout(@Request() req) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            await this.blacklistService.addToBlackList(token);
        }

        return {
            message: 'Logout successfully'
        }
    }
}
