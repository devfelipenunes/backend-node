// entities/User.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import Publication from "./Publication";

@Entity("users")
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  metamaskAddress?: string;

  @Column({ type: "boolean", default: false })
  isContentCreator: boolean;

  @Column({ type: "integer", nullable: true })
  monthlySubscriptionPrice?: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  stripeProductId?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  stripePriceId?: string;

  @Column({ type: "boolean", default: false })
  isSubscribed: boolean; // Novo campo para indicar se o usuário está assinado

  @OneToMany(() => Publication, (publication) => publication.author)
  publications: Publication[];
}

export default User;
