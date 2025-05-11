import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  message: string;

  @Column({ default: false })
  readed: boolean;
}
