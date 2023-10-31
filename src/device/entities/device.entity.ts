import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: null })
  userId: number;

  @Column()
  description: string;

  @Column()
  maxHourlyConsumption: number;

  @Column()
  address: string;
}
