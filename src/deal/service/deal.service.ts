import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { TradeEntity } from '../entity/trade.entity';
import { Repository, DataSource } from 'typeorm';
import { DealSearchParamDto } from '../dto/search-deal.dto';
import { RentEntity } from '../entity/rent.entity';
@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(TradeEntity)
    private tradeRepository: Repository<TradeEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}
  async getTradeData(searchParamDto: DealSearchParamDto): Promise<object> {
    try {
      const { bubJeongDongCode, jibun, page, numOfRows } = searchParamDto;

      const queryBuilder = this.tradeRepository
        .createQueryBuilder('trade')
        .select()
        .where('sigungu_code = :sigungu_code', {
          sigungu_code: bubJeongDongCode.substring(0, 5),
        })
        .andWhere('eubmyundong_code = :eubmyundong_code', {
          eubmyundong_code: bubJeongDongCode.substring(5),
        })
        .andWhere('jibun = :jibun', { jibun })
        .orderBy('deal_year', 'DESC')
        .addOrderBy('deal_month', 'DESC')
        .addOrderBy('deal_day', 'DESC')
        .limit(numOfRows)
        .offset((page - 1) * numOfRows);
      const [list, totalCount] = await queryBuilder.getManyAndCount();
      return {
        list,
        totalCount,
        page,
        numOfRows,
        lastPage: Math.ceil(totalCount / numOfRows),
      };
    } catch (error) {
      return { error, data: null };
    }
  }

  async getRentData(searchParamDto: DealSearchParamDto): Promise<object> {
    try {
      const { bubJeongDongCode, jibun, page, numOfRows } = searchParamDto;
      const queryBuilder = await this.dataSource
        .createQueryBuilder()
        .select([
          'id',
          `(CASE WHEN deal_type = 'monthlyRent' then CONCAT (deposit,'/',monthly_rent) else deposit end) as deal_amount`,
          `(CASE WHEN deal_type='rent' THEN '전세' ELSE '월세' END) AS deal_type_name`,
          'floor',
          'deal_year',
          'deal_month',
          'deal_day',
          'deal_type',
          `area_for_exclusive_use`,
        ])
        .from(RentEntity, 'rent')
        .where('regional_code = :regional_code', {
          regional_code: bubJeongDongCode.substring(0, 5),
        })
        .andWhere('jibun = :jibun', { jibun })
        .orderBy('deal_year', 'DESC')
        .addOrderBy('deal_month', 'DESC')
        .addOrderBy('deal_day', 'DESC')
        .limit(numOfRows)
        .offset((page - 1) * numOfRows);
      const list = await queryBuilder.getRawMany();
      const totalCount = await queryBuilder.getCount();
      return {
        list,
        totalCount,
        page,
        numOfRows,
        lastPage: Math.ceil(totalCount / numOfRows),
      };
    } catch (error) {
      return { error, data: null };
    }
  }

  async getTradeChartData(searchParamDto: DealSearchParamDto): Promise<object> {
    try {
      const { bubJeongDongCode, jibun } = searchParamDto;

      const tradeAvgData = await this.dataSource
        .createQueryBuilder()
        .select([
          'round(avg(deal_amount) / 10000,1) as dealAmount',
          `CONCAT(deal_year,'.',LPAD(deal_month,2,'0'),'.',LPAD(deal_day,2,'0')) as dealDate`,
          //`area_for_exclusive_use as areaForExclusiveUse`,
        ])
        .from(TradeEntity, 'trade')
        .where('sigungu_code = :sigungu_code', {
          sigungu_code: bubJeongDongCode.substring(0, 5),
        })
        .andWhere('eubmyundong_code = :eubmyundong_code', {
          eubmyundong_code: bubJeongDongCode.substring(5),
        })
        .andWhere('jibun = :jibun', { jibun })
        .groupBy('deal_year')
        .addGroupBy('deal_month')
        .addGroupBy('deal_day')
        .orderBy('deal_year', 'ASC')
        .addOrderBy('deal_month', 'ASC')
        .addOrderBy('deal_day', 'ASC')
        .getRawMany();
      const allTradeData = await this.tradeRepository
        .createQueryBuilder()
        .select([
          'round(deal_amount / 10000,1) as dealAmount',
          `CONCAT(deal_year,'.',LPAD(deal_month,2,'0'),'.',LPAD(deal_day,2,'0')) as dealDate`,
        ])
        .where('sigungu_code = :sigungu_code', {
          sigungu_code: bubJeongDongCode.substring(0, 5),
        })
        .andWhere('eubmyundong_code = :eubmyundong_code', {
          eubmyundong_code: bubJeongDongCode.substring(5),
        })
        .andWhere('jibun = :jibun', { jibun })
        .orderBy('deal_year', 'ASC')
        .addOrderBy('deal_month', 'ASC')
        .addOrderBy('deal_day', 'ASC')
        .getRawMany();
      return {
        tradeAvgData,
        allTradeData,
      };
    } catch (error) {
      return { error, data: null };
    }
  }

  async getRentChartData(searchParamDto: DealSearchParamDto): Promise<object> {
    try {
      const { bubJeongDongCode, jibun } = searchParamDto;

      const tradeAvgData = await this.dataSource
        .createQueryBuilder()
        .select([
          'round(avg(deposit) / 10000,1) as dealAmount',
          `CONCAT(deal_year,'.',LPAD(deal_month,2,'0'),'.',LPAD(deal_day,2,'0')) as dealDate`,
          //`area_for_exclusive_use as areaForExclusiveUse`,
        ])
        .from(RentEntity, 'rent')
        .where('regional_code = :regional_code', {
          regional_code: bubJeongDongCode.substring(0, 5),
        })
        .andWhere('jibun = :jibun', { jibun })
        .andWhere('deal_type=:dealType', { dealType: 'rent' })
        .groupBy('deal_year')
        .addGroupBy('deal_month')
        .addGroupBy('deal_day')
        .orderBy('deal_year', 'ASC')
        .addOrderBy('deal_month', 'ASC')
        .addOrderBy('deal_day', 'ASC')
        .getRawMany();
      const allTradeData = await this.dataSource
        .createQueryBuilder()
        .select([
          'round(deposit / 10000,1) as dealAmount',
          `CONCAT(deal_year,'.',LPAD(deal_month,2,'0'),'.',LPAD(deal_day,2,'0')) as dealDate`,
        ])
        .from(RentEntity, 'rent')
        .where('regional_code = :regional_code', {
          regional_code: bubJeongDongCode.substring(0, 5),
        })
        .andWhere('jibun = :jibun', { jibun })
        .andWhere('deal_type=:dealType', { dealType: 'rent' })
        .orderBy('deal_year', 'ASC')
        .addOrderBy('deal_month', 'ASC')
        .addOrderBy('deal_day', 'ASC')
        .getRawMany();
      return {
        tradeAvgData,
        allTradeData,
      };
    } catch (error) {
      return { error, data: null };
    }
  }
}
