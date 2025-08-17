import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // load .env globally
    SequelizeModule.forRootAsync({
      imports: [ConfigModule], // import ConfigModule here
      inject: [ConfigService], // inject ConfigService
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres', // ✅ or 'mysql '
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')), // ✅ use Number() instead of parseInt for clarity
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        models: [],
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
