import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { OtpService } from './otp.service';
import { OtpSchedulerService } from './otp-scheduler.service';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from './entities/otp.entity';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    TypeOrmModule.forFeature([OtpEntity]),
    ScheduleModule.forRoot(),
  ],
  providers: [OtpService, OtpSchedulerService],
  exports: [OtpService],
})
export class OtpModule {}
