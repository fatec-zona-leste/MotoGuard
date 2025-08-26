import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { Request, Response } from "express";
import { JWT_SECRET } from "../utils/vars";
import { AuthRequest } from "../middlewares/auth-middleware";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json([{ password: "Email e/ou senha inválidos" }]);

    const isValid = await bcrypt.compare(password, user.get("password"));
    if (!isValid) return res.status(401).json([{ password: "Email e/ou senha inválidos" }]);

    const token = jwt.sign(
      { id: user.get("id"), email: user.get("email") },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const userData = {
      id: user.get("id"),
      name: user.get("name"),
      email: user.get("email"),
      picture: user.get("picture")
    };

    res.json({ token, user: userData });
  } catch (err) {
    if (err instanceof Error) {
        res.status(500).json({ message: err.message });
    } else {
        res.status(500).json({ message: "Erro inesperado" });
    }
  }
};


export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Verifica se já existe usuário
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json([{ email: "Email já cadastrado" }]);

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      picture: "default.png" // ou outra lógica
    });

    res.status(201).json({ message: "Usuário criado", user });
  } catch (err) {
    if (err instanceof Error) {
        res.status(500).json({ message: err.message });
    } else {
        res.status(500).json({ message: "Erro inesperado" });
    }
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, picture } = req.body;

    const user = await User.findByPk(req.user?.id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    // Se o email foi alterado, verifica duplicidade
    if (email && email !== user.get("email")) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) return res.status(400).json([{ email: "Email já cadastrado" }]);
    }

    if(req.user?.id !== user.get("id")) {
      return res.status(403).json({ message: "Ação não permitida" });
    }

    user.set({
      name: name,
      email: email,
      picture: picture,
      password: await bcrypt.hash(password, 10),
    });
    
    const userData = {
      id: user.get("id"),
      name: user.get("name"),
      email: user.get("email"),
      picture: user.get("picture")
    };
    res.status(200).json({ message: "Usuário atualizado", user: userData });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Erro inesperado" });
    }
  }
};