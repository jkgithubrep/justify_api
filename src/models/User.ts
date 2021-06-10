import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { length: 200 })
  email!: string;

  @Column("varchar", { length: 200 })
  passhash!: string;

  @Column("boolean")
  validated!: boolean;
}
