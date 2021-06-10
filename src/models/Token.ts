import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { ApiRequest } from "./ApiRequest";

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("int")
  rate_limit!: number;

  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => ApiRequest, (request: ApiRequest) => request.token)
  requests!: Request[];
}
