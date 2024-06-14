// src/controllers/SubscriptionController.ts

import { Request, Response, Router } from "express";

import UserRepository from "../repositories/UserRepository";
import { stripeClient } from "../config/stripe";

const subscriptionRouter = Router();

subscriptionRouter.post("/subscribe", async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const user = await UserRepository.findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.monthlySubscriptionPrice) {
      return res.status(400).json({ message: "Subscription price not set" });
    }

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: `${user.monthlySubscriptionPrice}`,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: "https://seu-site.com/success",
      cancel_url: "https://seu-site.com/cancel",
    });

    return res.json({ sessionId: session.id });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(500).json({ message: errorMessage });
  }
});

export default subscriptionRouter;
