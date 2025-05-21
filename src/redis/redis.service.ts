import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly client: Redis;

    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || "localhost",
            port: Number(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD,
            retryStrategy: (times) => Math.min(times * 50, 2000),
        });

        this.client.on('connect', () => {
            console.log('RedisService: Connected to Redis');
        });

        this.client.on("error", (err) => {
            console.error("RedisService: Failed to connect:", err.message);
        });
    }

    async onModuleInit() {
        try {
            await this.client.ping();
        } catch (error) {
            console.error("RedisService: Error during onModuleInit:", error);
        }
    }

    async onModuleDestroy() {
        try {
            await this.client.quit();
        } catch (error) {
        }
    }

    getClient(): Redis {
        return this.client;
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        ttl
            ? await this.client.set(key, value, "EX", ttl)
            : await this.client.set(key, value);
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }
}