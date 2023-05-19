import { Module } from '@nestjs/common';
import { TradeModule } from './trade/trade.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as dotenv from 'dotenv';
import * as path from 'path';
import { ApartmentModule } from './apartment/apartment.module';
dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV === 'development'
      ? '.development.env'
      : process.env.NODE_ENV === 'stage'
      ? '.stage.env'
      : '.production.env',
  ),
});
@Module({
  imports: [
    TradeModule,
    ApartmentModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'estate',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
    }),
  ],
})
export class AppModule {}
