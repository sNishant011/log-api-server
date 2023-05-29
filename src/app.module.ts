import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import configuration from './configs/configuration';
import { CoreModule } from './configs/core.module';
import { UsersModule } from './users/users.module';
import { NginxLogsModule } from './nginx-logs/nginx-logs.module';
import { ApacheLogsModule } from './apache-logs/apache-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService<ReturnType<typeof configuration>>,
      ) => {
        const databaseConfig =
          configService.get<ReturnType<typeof configuration>['database']>(
            'database',
          );
        return {
          uri: databaseConfig.uri,
        };
      },
    }),
    CoreModule,
    UsersModule,
    AuthModule,
    NginxLogsModule,
    ApacheLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
