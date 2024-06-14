import { Request, Response, Router } from "express";
import PublicationRepository from "../repositories/PublicationRepository";
import UserRepository from "../repositories/UserRepository";

const publicationRouter = Router();

publicationRouter.post("/", async (req: Request, res: Response) => {
  const { title, description, media, price, userId } = req.body;

  try {
    const user = await UserRepository.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const publication = await PublicationRepository.createPublication(
      title,
      description,
      media,
      user
    );

    return res.json({ publication });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(500).json({ message: errorMessage });
  }
});

// Rota para listar todas as publicações
publicationRouter.get("/", async (req: Request, res: Response) => {
  try {
    const publications = await PublicationRepository.getAllPublications();
    return res.json({ publications });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(500).json({ message: errorMessage });
  }
});

publicationRouter.get("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await UserRepository.findUserById(parseInt(userId, 10));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let publications = await PublicationRepository.getPublicationsByUser(
      parseInt(userId, 10)
    );

    // Filtrar publicações pagas caso o usuário não seja assinante
    if (!user.isSubscribed) {
      publications = publications.filter((publication) => !publication.paid);
    }

    if (!publications || publications.length === 0) {
      return res
        .status(404)
        .json({ message: "No publications found for this user" });
    }

    return res.json({ publications });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(500).json({ message: errorMessage });
  }
});

export default publicationRouter;
