import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
@Entity('estate_rent')
export class RentEntity {
  @PrimaryGeneratedColumn()
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  use_request_renewal_contract_right: string;

  @Column()
  deposit: number;

  @Column({ nullable: true })
  contract_type: string;

  @Column({ nullable: true })
  term_of_contract: string;

  @Column({ nullable: true })
  monthly_rent: number;

  @Column({ nullable: true })
  previous_deposit: number;

  @Column({ nullable: true })
  previous_monthly_rent: number;

  @Column({ nullable: true })
  build_year: number;

  @Column()
  deal_year: number;

  @Column({ nullable: true })
  dong: string;

  @Column({ nullable: true })
  apartment_name: string;

  @Column()
  deal_month: number;

  @Column()
  deal_day: number;

  @Column()
  area_for_exclusive_use: number;

  @Column({ nullable: true })
  jibun: string;

  @Column({ nullable: true })
  regional_code: string;

  @Column({ nullable: true })
  floor: number;

  @Column({ default: 'rent' })
  deal_type: string;
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
