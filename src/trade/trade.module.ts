import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { TradeEntity } from './trade.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TradeEntity])],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
