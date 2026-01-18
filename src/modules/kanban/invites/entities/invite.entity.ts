import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Board } from '../../board/entities/board.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { InviteStatus } from '../enums/invite-status.enum';

@Entity()
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  token: string;

  @ManyToOne(() => Board)
  @JoinColumn()
  board: Board;

  @ManyToOne(() => User)
  @JoinColumn()
  creator: User;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  user?: User;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: InviteStatus,
    default: InviteStatus.PENDING,
  })
  status: InviteStatus;

  @Column()
  expiresAt: Date;

  @Column({
    nullable: true,
  })
  acceptedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
