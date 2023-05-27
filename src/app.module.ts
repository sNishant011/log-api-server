import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './configuration';
import { CoreModule } from './core.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
