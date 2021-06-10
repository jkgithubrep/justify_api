import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Token } from "./Token";

@Entity()
export class ApiRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("int")
  size!: number;

  @ManyToOne(() => Token, (token) => token.requests)
  @JoinColumn({ name: "token_id" })
  token!: Token;
}
