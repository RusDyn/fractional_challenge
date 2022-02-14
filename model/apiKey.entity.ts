import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'api_keys' })
export class ApiKeyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column('varchar', { length: 128, unique: true })
  key: string;
}
