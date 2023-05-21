import { Module } from '@nestjs/common';
import { BubjeongdongService } from './bubjeongdong.service';
import { BubjeongdongController } from './bubjeongdong.controller';
import { BubjeongdongEntity } from './entity/bubjeong.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([BubjeongdongEntity])],
  controllers: [BubjeongdongController],
  providers: [BubjeongdongService],
})
export class BubjeongdongModule {}
