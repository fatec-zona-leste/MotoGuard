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
    if (!user) return res.status(401).json({errors: { password: "Email e/ou senha inválidos" } });

    const isValid = await bcrypt.compare(password, user.get("password"));
    if (!isValid) return res.status(401).json({errors: { password: "Email e/ou senha inválidos" }});

    const token = jwt.sign(
      { id: user.get("id"), email: user.get("email"), role: user.get("role") },
      JWT_SECRET,
      { expiresIn: "365d" }
    );

    const userData = {
      id: user.get("id"),
      name: user.get("name"),
      email: user.get("email"),
      picture: user.get("picture"),
      emergency_number: user.get("emergency_number")
    };

    res.json({ token, user: userData });
  } catch (err) {
    res.status(500).json({message: "Erro ao realizar login", error: err instanceof Error ? err.message : err });
  }
};


export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, emergency_number } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({errors: { email: "Email já cadastrado" }});

    const user = await User.create({
      name,
      email,
      emergency_number: emergency_number ?? null,
      password: await bcrypt.hash(password, 10),
      picture: "default.png" // ou outra lógica
    });

    res.status(201).json({ message: "Usuário criado", user });
  } catch (err) {
     res.status(500).json({message: "Erro ao criar conta", error: err instanceof Error ? err.message : err });
  }
}; 

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, picture, emergency_number } = req.body;

    const user = await User.findByPk(req.user?.id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    // Se o email foi alterado, verifica duplicidade
    if (email && email !== user.get("email")) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) return res.status(400).json({errors: { email: "Email já cadastrado" }});
    }

    if(req.user?.id !== user.get("id")) {
      return res.status(403).json({ message: "Ação não permitida" });
    }

    user.set({
      name: name,
      emergency_number: emergency_number ?? null,
      email: email,
      picture: picture,
      password: await bcrypt.hash(password, 10),
    });

    user.save();
    
    const userData = {
      id: user.get("id"),
      name: user.get("name"),
      emergency_number: user.get("emergency_number"),
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

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email } = req.body;
  
    const user = await User.findByPk(req.user?.id);
    if (!user) return res.status(404).json({ message: "Conta não encontrada" });

    // Se o email foi alterado, verifica duplicidade
    if (email && email !== user.get("email")) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) return res.status(400).json({errors: { email: "Email já cadastrado" }});
    }

    user.set({
      name: name,
      email: email,
    });
    await user.save();

    const userData = {
      id: user.get("id"),
      name: user.get("name"),
      emergency_number: user.get("emergency_number"),
      email: user.get("email"),
      picture: user.get("picture")
    };
    return res.status(200).json({ message: "Conta atualizada", user: userData });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Erro inesperado" });
    }
  }
}

export const updateEmergencyContect = async (req: AuthRequest, res: Response) => {
  try {
    const { emergency_number } = req.body;
  
    const user = await User.findByPk(req.user?.id);
    if (!user) return res.status(404).json({ message: "Conta não encontrada" });

    user.set({
      emergency_number: emergency_number,
    });
    await user.save();

    const userData = {
      id: user.get("id"),
      name: user.get("name"),
      emergency_number: user.get("emergency_number"),
      email: user.get("email"),
      picture: user.get("picture")
    };
    return res.status(200).json({ message: "Contato atualizado", user: userData });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Erro inesperado" });
    }
  }
}

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { old_password, password } = req.body;
  
    const user = await User.findByPk(req.user?.id);
    if (!user) return res.status(404).json({ message: "Conta não encontrada" });

    const isValid = await bcrypt.compare(old_password, user.get("password"));
    if (!isValid) return res.status(400).json({errors: { old_password: "Senha incorreta" }});

    user.set({
      password: await bcrypt.hash(password, 10),
    });
    await user.save();

    return res.status(200).json({ message: "Senha atualizada" });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Erro inesperado" });
    }
  }
}

export const validateEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
  
    const user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({errors: { email: "E-mail já cadastrado" }});

    return res.status(200).json({ message: "E-mail não cadastrado" });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Erro inesperado" });
    }
  }
}

export async function destroy(req: AuthRequest, res: Response) {
    try {
        const { id } = req.params;

        const existingUser = await User.findOne({ where: { id: id } });
        if (!existingUser) return res.status(404).json({ message: "Usuário não encontrado" });
        
        if(req.user?.id !== existingUser.get("id")) return res.status(403).json({ message: "Acesso negado" });

        existingUser.destroy();
        return res.status(200).json({ message: "Conta excluida" });
    } catch (err) {
        res.status(500).json({message: "Erro ao remover usuário", error: err instanceof Error ? err.message : err });
    }
}