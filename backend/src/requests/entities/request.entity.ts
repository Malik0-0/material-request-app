import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MaterialDetail } from '../../material-details/entities/material-detail.entity';

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'date' })
  request_date!: string;

  @Column({ type: 'text' })
  requester_name!: string;

  @Column({ type: 'text', default: 'pending' })
  status!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at!: Date;

  @OneToMany(() => MaterialDetail, (materialDetail) => materialDetail.request)
  material_details!: MaterialDetail[];
}
