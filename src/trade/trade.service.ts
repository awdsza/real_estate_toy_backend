import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { TradeEntity } from './trade.entity';
import { Repository } from 'typeorm';
import { TradeSearchParamDto } from './dto/search-trade.dto';
@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(TradeEntity)
    private tradeRepository: Repository<TradeEntity>,
  ) {}
  private convertTradeData(item): object {
    return {
      deal_amount:
        typeof item['거래금액'] === 'number'
          ? item['거래금액']
          : (item['거래금액'] || '').replaceAll(',', ''),
      build_year: item['건축년도'],
      deal_year: item['년'],
      road_name: item['도로명'],
      road_name_bonbun: item['도로명건물본번호코드'],
      road_name_bubun: item['도로명건물부번호코드'],
      road_name_sigungu_code: item['도로명시군구코드'],
      road_name_seq: item['도로명일련번호코드'],
      road_name_basement_code: item['도로명지상지하코드'] || null,
      road_name_code: item['도로명코드'],
      dong: item['법정동'],
      bonbun: item['법정동본번코드'],
      bubun: item['법정동부번코드'],
      sigungu_code: item['법정동시군구코드'],
      eubmyundong_code: item['법정동읍면동코드'],
      land_code: item['법정동지번코드'],
      apartment_name: item['아파트'],
      deal_month: item['월'],
      deal_day: item['일'],
      sequence: item['일련번호'],
      area_for_exclusive_use: item['전용면적'],
      jibun: item['지번'],
      regional_code: item['지역코드'],
      floor: item['층'],
      cancel_deal_type: item['해제여부'],
      cancel_deal_day: item['해제사유발생일'],
      req_gbn: item['거래유형'],
      rdealer_lawdnm: item['중개사소재지'],
    };
  }
  async batch(yyyymm: number): Promise<void> {
    const url = process.env.JUSO_SIDO_URL;
    const sigunguUrl = process.env.JUSO_SIGUNGU_ENDPOINT;
    const tradeUrl = process.env.ESTATE_TRADE_DETAIL_END_POINT;
    try {
      const sidoResponse = await fetch(url);
      if (sidoResponse.ok) {
        const { regcodes: sidoCodes } = await sidoResponse.json();
        for (let i = 0; i < sidoCodes.length; i++) {
          const { code } = sidoCodes[i];
          const sigunguResponse = await fetch(
            `${sigunguUrl}${code.substring(0, 2)}***0000`,
          );
          if (sigunguResponse.ok) {
            const { regcodes: sigunguCodes } = await sigunguResponse.json();
            for (let j = 0; j < sigunguCodes.length; j++) {
              const { code: sigunguCode } = sigunguCodes[j];
              const tradeResponse = await fetch(
                `${tradeUrl}?pageNo=1&numOfRows=9999&LAWD_CD=${sigunguCode.substring(
                  0,
                  5,
                )}&DEAL_YMD=${yyyymm}&serviceKey=${
                  process.env.ESTATE_APP_API_KEY
                }`,
              );
              console.log(
                `${tradeUrl}?pageNo=1&numOfRows=9999&LAWD_CD=${sigunguCode.substring(
                  0,
                  5,
                )}&DEAL_YMD=${yyyymm}&serviceKey=${
                  process.env.ESTATE_APP_API_KEY
                }`,
              );
              if (tradeResponse.ok) {
                const text = await tradeResponse.text();
                if (XMLValidator.validate(text)) {
                  const res = new XMLParser({
                    ignoreAttributes: false,
                  }).parse(text);
                  const { header, body } = res.response;
                  if (header?.resultCode !== 0) {
                    throw new Error(header.resultMsg);
                  }
                  const { item: tradeLists } = body.items;
                  let bulkData = [];
                  if (tradeLists && !Array.isArray(tradeLists)) {
                    //단일 데이터는 object형태로 읽어오기때문에 배열에 합치는 전략을 사용
                    bulkData.push(this.convertTradeData(tradeLists));
                  } else if (tradeLists && tradeLists.length > 0) {
                    bulkData = bulkData.concat(
                      tradeLists.map((item) => this.convertTradeData(item)),
                    );
                  }
                  if (bulkData.length > 0) {
                    this.tradeRepository
                      .createQueryBuilder()
                      .insert()
                      .into(TradeEntity)
                      .values(bulkData)
                      .execute();
                  }
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getTradeData(searchParamDto: TradeSearchParamDto): Promise<object> {
    try {
      const { bubJeongDongCode, jibun, dealYear } = searchParamDto;

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
        .andWhere('deal_year = :dealYear', { dealYear })
        .orderBy('deal_month', 'DESC')
        .addOrderBy('deal_day', 'DESC');
      return { data: await queryBuilder.getMany() };
    } catch (error) {
      return { error, data: null };
    }
  }
}
