import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { TradeEntity } from '../entity/trade.entity';
import { Repository, DataSource } from 'typeorm';
import { RentEntity } from '../entity/rent.entity';
@Injectable()
export class BatchService {
  constructor(
    @InjectRepository(TradeEntity)
    private tradeRepository: Repository<TradeEntity>,
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(RentEntity)
    private rentEntity: Repository<RentEntity>,
  ) {}
  private convertNumberFormat(item): string {
    return typeof item === 'number' ? item : (item || '').replaceAll(',', '');
  }
  private convertRentData(item): object {
    return {
      use_request_renewal_contract_right: item['갱신요구권사용'] || '',
      build_year: item['건축년도'],
      deposit: this.convertNumberFormat(item['보증금액']),
      contract_type: item['계약구분'] || '',
      term_of_contract: item['계약기간'] || '',
      deal_year: item['년'],
      dong: item['법정동'],
      apartment_name: item['아파트'],
      deal_month: item['월'],
      monthly_rent: this.convertNumberFormat(item['월세금액']),
      deal_day: item['일'],
      area_for_exclusive_use: item['전용면적'],
      previous_deposit: parseInt(item['종전계약 보증금'] || 0),
      previous_monthly_rent: parseInt(item['종전계약월세'] || 0),
      jibun: item['지번'],
      regional_code: item['지역코드'],
      floor: item['층'],
      deal_type:
        parseInt(item['월세금액'] || '0') === 0 ? 'rent' : 'monthlyRent',
    };
  }
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
  async tradeBatch(yyyymm: number): Promise<void> {
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
                    bulkData.push({
                      ...this.convertTradeData(tradeLists),
                      deal_type: 'trade',
                    });
                  } else if (tradeLists && tradeLists.length > 0) {
                    bulkData = bulkData.concat(
                      tradeLists.map((item) => ({
                        ...this.convertTradeData(item),
                        deal_type: 'trade',
                      })),
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

  async rentBatch(yyyymm: number): Promise<void> {
    const url = process.env.JUSO_SIDO_URL;
    const sigunguUrl = process.env.JUSO_SIGUNGU_ENDPOINT;
    const rentUrl = process.env.ESTATE_RENT_DETAIL_END_POINT;
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
                `${rentUrl}?numOfRows=9999&LAWD_CD=${sigunguCode.substring(
                  0,
                  5,
                )}&DEAL_YMD=${yyyymm}&serviceKey=${
                  process.env.ESTATE_APP_API_KEY
                }`,
              );
              console.log(
                `${rentUrl}?pageNo=1&numOfRows=9999&LAWD_CD=${sigunguCode.substring(
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
                    bulkData.push(this.convertRentData(tradeLists));
                  } else if (tradeLists && tradeLists.length > 0) {
                    bulkData = bulkData.concat(
                      tradeLists.map((item) => this.convertRentData(item)),
                    );
                  }
                  //  console.log(bulkData);
                  if (bulkData.length > 0) {
                    this.rentEntity
                      .createQueryBuilder()
                      .insert()
                      .into(RentEntity)
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
}
