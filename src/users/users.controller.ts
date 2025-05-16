import { Controller, Get, UseGuards, Request, Patch, Body } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UpdatePasswordDto } from "./dtos/update-password.dto";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    public async getProfile(@Request() req) {
        return {
            message: 'Authenticated_user',
            user: req.user,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update/password')
    public async updatePassword(@Request() req, @Body() dto: UpdatePasswordDto) {
        await this.usersService.updatePassword(req.user.id, dto)
        return {
            message: 'Password_updated_successfully'
        }
    }
}