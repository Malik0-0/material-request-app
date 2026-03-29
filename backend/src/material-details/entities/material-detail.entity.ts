import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Request } from '../../requests/entities/request.entity';

@Entity('material_details')
export class MaterialDetail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer' })
  request_id!: number;

  @Column({ type: 'text' })
  material_description!: string;

  @Column({ type: 'integer' })
  quantity!: number;

  @Column({ type: 'text' })
  unit!: string;

  @Column({ type: 'numeric', nullable: true })
  price!: number | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @ManyToOne(() => Request, (request) => request.material_details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'request_id' })
  request!: Request;
}
