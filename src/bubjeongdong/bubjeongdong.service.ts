import { Injectable } from '@nestjs/common';
import { BubjeongdongEntity } from './entity/bubjeong.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class BubjeongdongService {
  constructor(
    @InjectRepository(BubjeongdongEntity)
    private bubjeongdongRepository: Repository<BubjeongdongEntity>,
  ) {}
  async getBubjeongdongList(code: string): Promise<object> {
    try {
      const queryBuilder = this.bubjeongdongRepository
        .createQueryBuilder('bjd')
        .select([`bubjeongdong_code as code`, `bubjeongdong_name as name`]);
      if (code) {
        queryBuilder.where("bubjeongdong_code like CONCAT(:code,'%')", {
          code,
        });
        queryBuilder.andWhere('bubjeongdong_level =2');
      } else {
        queryBuilder.where('bubjeongdong_level = 1');
      }
      return {
        error: null,
        data: await queryBuilder
          .andWhere("isClose='N'")
          .orderBy('bubjeongdong_code')
          .getRawMany(),
      };
    } catch (error) {
      return { error, data: null };
    }
  }
}
