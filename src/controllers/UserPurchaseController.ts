// controllers/UserPurchaseController.ts

import { Request, Response, Router } from "express";
import UserPurchaseRepository from "../repositories/UserPurchaseRepository";
import PublicationRepository from "../repositories/PublicationRepository";
import UserRepository from "../repositories/UserRepository";

const userPurchaseRouter = Router();

userPurchaseRouter.post("/purchase", async (req: Request, res: Response) => {
  const { userId, publicationId } = req.body;

  try {
    const user = await UserRepository.findUserById(userId);
    const publication = await PublicationRepository.findOne(publicationId);

    if (!user || !publication) {
      return res.status(404).json({ message: "User or Publication not found" });
    }

    const userPurchase = await UserPurchaseRepository.createUserPurchase(
      userId,
      publicationId
    );

    return res.json({ userPurchase });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(500).json({ message: errorMessage });
  }
});

export default userPurchaseRouter;
