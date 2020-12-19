import { GatewayHelperService } from './services/gatewayhelper.service';
import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from './app.gateway';
import { CronService } from './services/cron.service';
import { Service } from './entities/service.entity';
import { ServiceModel } from './models/service.model';
import { AppRespository } from './app.repository';
import { DowntimeModel } from './models/downtime.model';
import { WebHook } from './entities/webhook.entity';
import { WebHookModel } from './models/webhook.model';
import { ServiceDowntime } from './entities/serviceDowntime.entity';
import { WebHookService } from './services/webhook.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Service, WebHook, ServiceDowntime]),
    ScheduleModule.forRoot(), HttpModule,
  ],
  providers: [
    GatewayHelperService, AppGateway, CronService, ServiceModel, AppRespository, DowntimeModel, WebHookService, WebHookModel],
})
export class AppModule { }
