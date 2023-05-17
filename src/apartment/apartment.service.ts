import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApartmentViewEntity } from './entity/apartment.view.entity';
import { ApartSearchParamDto } from './dto/search-apartment.dto';
@Injectable()
export class ApartmentService {
  constructor(
    @InjectRepository(ApartmentViewEntity)
    private apartView: Repository<ApartmentViewEntity>,
  ) {}

  async getApartmentList(
    apartSearchParamDto: ApartSearchParamDto,
  ): Promise<[ApartmentViewEntity[], number]> {
    const { bubJeongDongCode, keyword, numOfRows, page, id } =
      apartSearchParamDto;
    try {
      const queryBuilder = this.apartView
        .createQueryBuilder('apart')
        .select()
        .where('1=1');
      if (id) {
        queryBuilder.andWhere('id < :id', { id });
      }
      if (bubJeongDongCode) {
        queryBuilder.andWhere(
          "bubjeongdongCode LIKE CONCAT(:bubJeongDongCode,'%')",
          {
            bubJeongDongCode,
          },
        );
      }
      if (keyword) {
        queryBuilder.andWhere("apartmentName like CONCAT(:keyword,'%')", {
          keyword: decodeURIComponent(keyword),
        });
      }
      return queryBuilder
        .orderBy('dealYear', 'DESC')
        .addOrderBy('dealMonth', 'DESC')
        .addOrderBy('dealDay', 'DESC')
        .addOrderBy('id', 'DESC')
        .limit(numOfRows)
        .offset((page - 1) * numOfRows)
        .getManyAndCount();
    } catch (e) {}
  }
}
