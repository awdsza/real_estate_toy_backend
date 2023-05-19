import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'apartView',
  expression: `
  select 
  et_data.id AS "id",
  et_data.bubjeongdong_code as "bubjeongdongCode",
  et_data.jibun as "jibun",
  et_data.apartment_name as "apartmentName",
  CONCAT (sigungu.bubjeongdong_name, ' ', et_data.road_name,' ',et_data.road_name_bonbun, 
  (CASE WHEN et_data.road_name_bubun IS NOT NULL THEN CONCAT('-',et_data.road_name_bubun) ELSE '' END )
  ) as "roadAddress",
  CONCAT (bjd.bubjeongdong_name, ' ', et_data.jibun) as "jibunAddress",
  CONCAT (deal_year,'년 ',deal_month,'월 ',deal_day,'일') as dealDate,
  et_data.deal_year as dealYear,
  et_data.deal_month as dealMonth,
  et_data.deal_day as dealDay,
  et_data.build_year as buildYear
  FROM
  (
  select
  MAX(et.id) AS "id",
  concat(et.sigungu_code,et.eubmyundong_code) AS "bubjeongdong_code",
  concat(et.sigungu_code,'00000') AS "sigungu_code",
  et.jibun as "jibun",
  et.apartment_name as "apartment_name",
  et.road_name as "road_name",
  et.road_name_bonbun as "road_name_bonbun",
  (case when et.road_name_bubun='0' then NULL else et.road_name_bubun end ) as "road_name_bubun",
  max(deal_year) as "deal_year",
  max(deal_month) as "deal_month",
  max(deal_day) as "deal_day",
  max(build_year) as "build_year"
from
  estate_trades et
group by
  et.sigungu_code,
  et.eubmyundong_code,
  et.jibun,
  et.apartment_name,
  et.road_name,
  et.road_name_bonbun,
  et.road_name_bubun
  ) et_data JOIN
  bubjeongdong bjd
  ON et_data.bubjeongdong_code=bjd.bubjeongdong_code 
  JOIN bubjeongdong sigungu
 on et_data.sigungu_code = sigungu.bubjeongdong_code and sigungu.bubjeongdong_level=2
 ;`,
})
export class ApartmentViewEntity {
  @ViewColumn()
  id: number;
  @ViewColumn()
  bubjeongdongCode: string;
  @ViewColumn()
  jibun: string;
  @ViewColumn()
  apartmentName: string;
  @ViewColumn()
  roadAddress: string;
  @ViewColumn()
  jibunAddress: string;
  @ViewColumn()
  dealDate: string;
  @ViewColumn()
  dealYear: number;
  @ViewColumn()
  dealMonth: number;
  @ViewColumn()
  dealDay: number;
  @ViewColumn()
  buildYear: number;
}
