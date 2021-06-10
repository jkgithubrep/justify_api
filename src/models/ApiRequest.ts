import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Token } from "./Token";

@Entity()
export class ApiRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("int")
  size!: number;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Token, (token) => token.requests)
  @JoinColumn({ name: "token_id" })
  token!: Token;
}
