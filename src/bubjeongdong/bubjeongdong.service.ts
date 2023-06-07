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
      const queryBuilder =
        this.bubjeongdongRepository.createQueryBuilder('bjd');
      if (code) {
        //(select bubjeongdong_name from bubjeongdong sub where sub.bubjeongdong_code= concat(11,'00000000'))
        queryBuilder
          .select([
            `bubjeongdong_code as code`,
            `replace(bubjeongdong_name ,CONCAT((select bubjeongdong_name from bubjeongdong sub where sub.bubjeongdong_code= concat(${code},'00000000')),' '),'') as name`,
          ])
          .where("bubjeongdong_code like CONCAT(:code,'%')", {
            code,
          });
        queryBuilder.andWhere('bubjeongdong_level =2');
      } else {
        queryBuilder
          .select([`bubjeongdong_code as code`, `bubjeongdong_name as name`])
          .where('bubjeongdong_level = 1');
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
