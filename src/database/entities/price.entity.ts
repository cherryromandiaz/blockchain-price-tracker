import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  chain: string;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  price: number;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;
}
