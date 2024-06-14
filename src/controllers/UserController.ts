import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/UserRepository";
import { stripeClient } from "../config/stripe";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const userRouter = Router();

// Rota de registro e login combinados
userRouter.post("/register", async (req: Request, res: Response) => {
  const { email, password, metamaskAddress } = req.body;

  try {
    if ((email && password) || metamaskAddress) {
      // Registro com email e senha
      if (email && password) {
        // Verifica se já existe um Metamask associado ao email
        const existingMetamaskUser =
          await UserRepository.findUserByMetamaskAddress(email);
        if (existingMetamaskUser) {
          return res.status(400).json({
            message: "Metamask address already registered with this email",
          });
        }

        // Verifica se já existe um usuário com o email fornecido
        let user = await UserRepository.findUserByEmail(email);
        if (user) {
          return res.status(400).json({ message: "Email already registered" });
        }

        // Hash da senha antes de salvar
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await UserRepository.createUser(email, hashedPassword);

        // Gera token JWT
        const token = jwt.sign({ id: user.id }, JWT_SECRET);

        return res.json({ token, user });
      }

      // Registro com Metamask address
      if (metamaskAddress) {
        // Verifica se já existe um email associado ao Metamask address
        const existingEmailUser = await UserRepository.findUserByEmail(
          metamaskAddress
        );
        if (existingEmailUser) {
          return res.status(400).json({
            message: "Email already registered with this Metamask address",
          });
        }

        // Verifica se já existe um usuário com o Metamask address fornecido
        let user = await UserRepository.findUserByMetamaskAddress(
          metamaskAddress
        );
        if (user) {
          // Se o usuário já existe, retorna token JWT
          const token = jwt.sign({ id: user.id }, JWT_SECRET);
          return res.json({ token, user });
        }

        // Cria um novo usuário com Metamask address
        user = await UserRepository.createUser(null, null, metamaskAddress);

        // Gera token JWT
        const token = jwt.sign({ id: user.id }, JWT_SECRET);

        return res.json({ token, user });
      }
    }

    // Se nenhum dos casos acima for atendido, retorna erro de dados inválidos
    return res.status(400).json({ message: "Invalid registration data" });
  } catch (error) {
    // Captura erros e retorna mensagem de erro interna
    const errorMessage = (error as Error).message;
    return res.status(500).json({ message: errorMessage });
  }
});

// Rota de login
userRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password, metamaskAddress } = req.body;

  try {
    let user;

    // Verifica se o login está sendo feito com email e senha
    if (email && password) {
      user = await UserRepository.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET);
      return res.json({ token, user });
    }

    // Verifica se o login está sendo feito com Metamask address
    if (metamaskAddress) {
      user = await UserRepository.findUserByMetamaskAddress(metamaskAddress);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET);
      return res.json({ token, user });
    }

    // Se nenhum dos casos acima for atendido, retorna erro de dados inválidos
    return res.status(400).json({ message: "Invalid login data" });
  } catch (error) {
    // Captura erros e retorna mensagem de erro interna
    const errorMessage = (error as Error).message;
    return res.status(500).json({ message: errorMessage });
  }
});

userRouter.put("/content-creator", async (req: Request, res: Response) => {
  const { userId, isContentCreator, monthlySubscriptionPrice } = req.body;

  try {
    if (isContentCreator && monthlySubscriptionPrice !== undefined) {
      if (monthlySubscriptionPrice <= 0) {
        return res.status(400).json({
          message: "Monthly subscription price must be a positive number",
        });
      }

      // Criar produto no Stripe
      const product = await stripeClient.products.create({
        name: "Monthly Subscription", // Nome do produto no Stripe
        type: "service",
      });

      // Criar preço (plano) no Stripe associado ao produto
      const price = await stripeClient.prices.create({
        unit_amount: monthlySubscriptionPrice * 100, // Converter para centavos
        currency: "usd", // Moeda do preço (exemplo: USD)
        recurring: { interval: "month" }, // Frequência da cobrança (mensal)
        product: product.id,
      });

      // Atualizar no banco de dados se o usuário é um criador de conteúdo
      const updatedUser = await UserRepository.updateUserContentCreator(
        userId,
        true,
        monthlySubscriptionPrice,
        product.id, // ID do produto no Stripe
        price.id // ID do preço (plano) no Stripe
      );

      return res.json({ user: updatedUser });
    } else {
      const updatedUser = await UserRepository.updateUserContentCreator(
        userId,
        false,
        0,
        "",
        ""
      );

      return res.json({ user: updatedUser });
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(500).json({ message: errorMessage });
  }
});

// Rota para configurar assinatura
userRouter.post("/setup-subscription", async (req: Request, res: Response) => {
  const { userId, monthlySubscriptionPrice } = req.body;

  try {
    const user = await UserRepository.findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const price = await stripeClient.prices.create({
      unit_amount: monthlySubscriptionPrice * 100, // Valor em centavos
      currency: "usd",
      recurring: { interval: "month" }, // Assinatura mensal
    });

    user.monthlySubscriptionPrice = monthlySubscriptionPrice;
    await UserRepository.saveUser(user);

    return res.json({ message: "Subscription price set successfully", price });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(500).json({ message: errorMessage });
  }
});

export default userRouter;
