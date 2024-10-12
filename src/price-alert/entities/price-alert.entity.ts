import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PriceAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string;

  @Column('decimal')
  dollar: number;

  @Column()
  email: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
