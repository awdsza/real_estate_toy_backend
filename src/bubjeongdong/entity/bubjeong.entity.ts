import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bubjeongdong')
export class BubjeongdongEntity {
  @Column()
  @PrimaryColumn()
  bubjeongdong_code: string;
  @Column()
  bubjeongdong_name: string;
  @Column()
  isClose: string;
  @Column()
  bubjeongdong_level: number;
}
