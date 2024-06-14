import { AppDataSource } from "../database/data-source";
import User from "../entities/User";

const UserRepository = AppDataSource.getRepository(User);

const createUser = (
  email: string | null,
  password: string | null,
  metamaskAddress?: string | null
): Promise<User> => {
  const user = new User();
  user.email = email || "";
  user.password = password || "";
  if (metamaskAddress) {
    user.metamaskAddress = metamaskAddress;
  }
  return UserRepository.save(user);
};

const findUserByEmail = (email: string): Promise<User | null> => {
  return UserRepository.findOne({ where: { email } });
};

const findUserByMetamaskAddress = (
  metamaskAddress: string
): Promise<User | null> => {
  return UserRepository.findOne({ where: { metamaskAddress } });
};

const findUserById = (id: number): Promise<User | null> => {
  return UserRepository.findOne({ where: { id } });
};

const saveUser = (user: User): Promise<User> => {
  return UserRepository.save(user);
};

const updateUserContentCreator = async (
  id: number,
  isContentCreator: boolean,
  monthlySubscriptionPrice: number,
  stripeProductId: string,
  stripePriceId: string
): Promise<User | boolean> => {
  const user = await UserRepository.findOne({ where: { id } });

  if (user) {
    user.isContentCreator = isContentCreator;
    user.monthlySubscriptionPrice = monthlySubscriptionPrice;
    user.stripeProductId = stripeProductId;
    user.stripePriceId = stripePriceId;
    return UserRepository.save(user);
  }
  return false;
};

const updateUserMonthlySubscription = async (
  id: number,
  monthlySubscriptionPrice: number
): Promise<User | boolean> => {
  const user = await UserRepository.findOne({ where: { id } });
  if (user) {
    user.monthlySubscriptionPrice = monthlySubscriptionPrice;
    return UserRepository.save(user);
  }
  return false;
};

export default {
  createUser,
  findUserByEmail,
  findUserByMetamaskAddress,
  findUserById,
  saveUser,
  updateUserContentCreator,
  updateUserMonthlySubscription,
};
