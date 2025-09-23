import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  exports: [DatabaseService],
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('POSTGRES_URL'),
        port: config.get<number>('POSTGRES_PORT'),
        database: config.get<string>('POSTGRES_DATABASE'),
        username: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        retryAttempts: 0,
        ssl:
          config.get<string>('POSTGRES_SSL') === 'true'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
