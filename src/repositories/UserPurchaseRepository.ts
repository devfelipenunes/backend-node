// repositories/UserPurchaseRepository.ts

import { Repository } from "typeorm";
import UserPurchase from "../entities/UserPurchase";
import { AppDataSource } from "../database/data-source";

const UserPurchaseRepository = AppDataSource.getRepository(UserPurchase);

const createUserPurchase = (
  userId: number,
  publicationId: number
): Promise<UserPurchase> => {
  const userPurchase = new UserPurchase();
  userPurchase.user = { id: userId } as any;
  userPurchase.publication = { id: publicationId } as any;
  userPurchase.purchaseDate = new Date();
  return UserPurchaseRepository.save(userPurchase);
};

const findUserPurchase = (
  userId: number,
  publicationId: number
): Promise<UserPurchase | null> => {
  return UserPurchaseRepository.findOne({
    where: {
      user: { id: userId },
      publication: { id: publicationId },
    },
  });
};

export default {
  createUserPurchase,
  findUserPurchase,
};
