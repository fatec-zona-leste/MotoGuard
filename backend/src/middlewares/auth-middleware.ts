import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/vars";

export interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token não fornecido" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) ;
    console.log(token);
    
    req.user = payload as { id: number; email: string };
    next();
  } catch {
    res.status(403).json({ message: "Token inválido" });
  }
};
