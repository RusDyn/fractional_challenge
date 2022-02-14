import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiKeyEntity } from './apiKey.entity';

@Entity({ name: 'api_key_history' })
export class ApiKeyHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  apiId: number;

  @ManyToOne((type) => ApiKeyEntity)
  api: ApiKeyEntity;

  @Column('varchar', { length: 128 })
  message: string;

  @Column({ default: 0 })
  weight: number;

  @CreateDateColumn({
    name: 'time',
    type: 'timestamp',
    default: () => 'now()',
  })
  time: Date;
}
