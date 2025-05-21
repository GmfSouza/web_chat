import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class BlackListService {
    constructor(
        private readonly redisService: RedisService,
        private readonly jwtService: JwtService,
    ) {}

    async addToBlackList(token: string): Promise<void> {
        try {
            const decoded = this.jwtService.decode(token) as { exp: number };
            if (!decoded || !decoded.exp) {
                return;
            }

            const ttl = decoded.exp - Math.floor(Date.now() / 1000);
            if (ttl > 0) {
                const key = `blacklist:${token}`;
                await this.redisService.set(key, 'true', ttl);
            }
        } catch (error) {
            console.error('BlackListService: Error to decode:', error.message);
        }
    }

    async isBlackListed(token: string): Promise<boolean> {
        const key = `blacklist:${token}`;
        const blackListToken = await this.redisService.get(key);
        return !!blackListToken;
    }
}