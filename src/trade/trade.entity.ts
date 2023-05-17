import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
@Entity('estate_trades')
export class TradeEntity {
  @PrimaryGeneratedColumn()
  @PrimaryColumn()
  id: number;

  @Column()
  deal_amount: number;

  @Column()
  build_year: number;

  @Column()
  deal_year: number;

  @Column({ nullable: true })
  road_name: string;

  @Column({ nullable: true })
  road_name_bonbun: string;

  @Column({ nullable: true })
  road_name_bubun: string;

  @Column({ nullable: true })
  road_name_sigungu_code: string;

  @Column({ nullable: true })
  road_name_seq: string;

  @Column({ nullable: true })
  road_name_basement_code: string;

  @Column({ nullable: true })
  road_name_code: string;

  @Column({ nullable: true })
  dong: string;

  @Column({ nullable: true })
  bonbun: string;

  @Column({ nullable: true })
  bubun: string;

  @Column({ nullable: true })
  sigungu_code: string;

  @Column({ nullable: true })
  eubmyundong_code: string;

  @Column({ nullable: true })
  land_code: string;

  @Column({ nullable: true })
  apartment_name: string;

  @Column()
  deal_month: number;

  @Column()
  deal_day: number;

  @Column({ nullable: true })
  sequence: string;

  @Column()
  area_for_exclusive_use: number;

  @Column({ nullable: true })
  jibun: string;

  @Column({ nullable: true })
  regional_code: string;

  @Column({ nullable: true })
  floor: number;

  @Column({ nullable: true })
  cancel_deal_type: string;

  @Column({ nullable: true })
  cancel_deal_day: string;

  @Column({ nullable: true })
  req_gbn: string;

  @Column({ nullable: true })
  rdealer_lawdnm: string;

  @Column({
    type: 'datetime',
    default: () => 'NOW()',
    nullable: true,
  })
  created_at: Date;
  @Column({
    type: 'datetime',
    default: () => 'NOW()',
    nullable: true,
  })
  updated_at: Date;
  @Column({
    type: 'datetime',
    default: () => 'NOW()',
    nullable: true,
  })
  published_at: Date;
}
