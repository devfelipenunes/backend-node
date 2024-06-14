// entities/Publication.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import User from "./User";

@Entity()
export default class Publication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column("simple-array", { nullable: true })
  media: { url: string; paid: boolean; price: number }[];

  @ManyToOne(() => User, (user) => user.publications)
  author: User;

  @Column({ type: "boolean", default: false })
  paid: boolean; // Novo campo para indicar se a publicação é paga
}
