import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BoardColumnStatus } from '../enums/board-column-status.enum';
import { Board } from '../../board/entities/board.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity()
export class BoardColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: BoardColumnStatus,
  })
  status: BoardColumnStatus;

  @ManyToOne(() => Board, (board) => board.columns)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @OneToMany(() => Task, (task) => task.column)
  tasks: Task[];
}
