import { User } from './user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @Column('decimal')
  amount: number;

  @Column('decimal')
  rate: number;

  @Column()
  fromCurrency: string;

  @Column()
  toCurrency: string;

  @Column('decimal')
  convertedAmount: number;

  @CreateDateColumn()
  timestamp: Date;
}
