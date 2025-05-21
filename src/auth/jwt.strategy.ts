import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { BlackListService } from './blacklist.service';
import { JwtPayload } from '../types/jwt-payload.interface';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersService: UsersService,
        private readonly blacklistService: BlackListService,
    ) {
        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: process.env.JWT_SECRET || (() => { throw new Error('JWT_SECRET is not defined'); })(),
        passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: JwtPayload) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
        throw new UnauthorizedException('Missing token');
        }

        if (token && (await this.blacklistService.isBlackListed(token))) {
        throw new UnauthorizedException('Token is blacklisted');
        }

        const user = await this.usersService.findById(payload.sub);
        if (!user) {
        throw new UnauthorizedException('Invalid credentials');
        }

        return {
        id: payload.sub,
        email: payload.email,
        };
    }
}