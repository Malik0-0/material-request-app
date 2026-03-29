import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsModule } from './requests/requests.module';
import { MaterialDetailsModule } from './material-details/material-details.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', databaseConfig.host),
        port: configService.get<number>('DB_PORT', databaseConfig.port),
        username: configService.get<string>(
          'DB_USERNAME',
          databaseConfig.username,
        ),
        password: configService.get<string>(
          'DB_PASSWORD',
          databaseConfig.password,
        ),
        database: configService.get<string>('DB_NAME', databaseConfig.database),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    RequestsModule,
    MaterialDetailsModule,
  ],
})
export class AppModule {}
