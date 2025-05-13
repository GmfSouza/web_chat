import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { hash } from 'bcrypt';
import { randomInt } from 'crypto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateUserDto) {
        const { email } = dto;
        const userExists = await this.prisma.user.findUnique({ where: { email }});
        if(userExists) {
            throw new HttpException('Sorry, this email is already in use', HttpStatus.CONFLICT);
        }
        const randomSalt = randomInt(10, 16)
        const hashPassword = await hash(dto.password, randomSalt);

        return await this.prisma.user.create({
            data:{...dto, password: hashPassword}
        });
    }

    async findByEmail(email: string) {
        const user = await this.prisma.user.findUnique({where: {email}});
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return user;
    }

    async findAll() {
        return await this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
            }
        });
    }

    async findById(id: number) {
        const user = await this.prisma.user.findUnique({ where: { id }})
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return user;
    }
}
