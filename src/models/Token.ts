import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("int")
  rate_limit!: number;

  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;
}
