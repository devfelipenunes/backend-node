// entities/UserPurchase.ts

import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import User from "./User";
import Publication from "./Publication";

@Entity()
export default class UserPurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Publication)
  publication: Publication;

  @Column()
  purchaseDate: Date;
}
