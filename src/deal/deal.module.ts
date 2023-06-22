import { RentEntity } from './entity/rent.entity';
import { Module } from '@nestjs/common';
import { TradeController } from './deal.controller';
import { TradeService } from './service/deal.service';
import { TradeEntity } from './entity/trade.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchService } from './service/batch.service';
@Module({
  imports: [TypeOrmModule.forFeature([TradeEntity, RentEntity])],
  controllers: [TradeController],
  providers: [TradeService, BatchService],
})
export class DealModule {}
