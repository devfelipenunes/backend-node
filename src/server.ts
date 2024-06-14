import "reflect-metadata";
import express from "express";
import cors from "cors";

import routers from "./routes/routes";
import { AppDataSource } from "./database/data-source";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(routers);

AppDataSource.initialize().then(async () => {
  console.log("Data Source has been initialized!");
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentação da API",
      version: "1.0.0",
      description: "Descrição da API",
    },
  },
  apis: [path.join(__dirname, "./**/*.ts")], // Caminho para os arquivos que contêm as definições das rotas
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
