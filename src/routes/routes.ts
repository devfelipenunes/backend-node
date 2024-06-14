import { Router } from "express";
import userRouter from "../controllers/UserController";
import publicationRouter from "../controllers/PublicationController";
import subscriptionRouter from "../controllers/SubscriptionController";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const routers = Router();

routers.use("/user", userRouter);
routers.use("/post", authenticationMiddleware, publicationRouter);
routers.use("/subscription", authenticationMiddleware, subscriptionRouter);

export default routers;
