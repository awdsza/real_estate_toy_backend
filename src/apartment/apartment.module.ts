import { Module } from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { ApartmentController } from './apartment.controller';
import { ApartmentViewEntity } from './entity/apartment.view.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([ApartmentViewEntity])],
  controllers: [ApartmentController],
  providers: [ApartmentService],
})
export class ApartmentModule {}
