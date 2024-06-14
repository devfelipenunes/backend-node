import "reflect-metadata";
import { DataSource } from "typeorm";
import User from "../entities/User";
import Publication from "../entities/Publication";
import UserPurchase from "../entities/UserPurchase";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "149.100.155.154",
  port: 3306,
  username: "u245073799_felipinhopeni",
  password: "12345678#Fe",
  database: "u245073799_felipetermuxga",
  synchronize: true,
  timezone: "+03:00",
  logging: false,
  entities: [User, Publication, UserPurchase],
  migrations: [],
  subscribers: [],
});
