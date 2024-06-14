// src/repositories/PublicationRepository.ts

import Publication from "../entities/Publication";
import User from "../entities/User";
import { AppDataSource } from "../database/data-source";

const PublicationRepository = AppDataSource.getRepository(Publication);

const createPublication = (
  title: string,
  description: string,
  media: { url: string; paid: boolean; price: number }[],
  author: User
): Promise<Publication> => {
  const publication = new Publication();
  publication.title = title;
  publication.description = description;
  publication.media = media;
  publication.author = author;
  return PublicationRepository.save(publication);
};

const getAllPublications = (): Promise<Publication[]> => {
  return PublicationRepository.find();
};

const getPublicationsByUser = (userId: number): Promise<Publication[]> => {
  return PublicationRepository.createQueryBuilder("publication")
    .leftJoinAndSelect("publication.author", "author")
    .where("author.id = :userId", { userId })
    .getMany();
};

const findOne = (id: number): Promise<Publication | null> => {
  return PublicationRepository.findOneBy({ id });
};
export default {
  createPublication,
  getAllPublications,
  getPublicationsByUser,
  findOne,
};
