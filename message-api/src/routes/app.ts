import express, { Request, Response } from "express";
import { WhatsApp } from "../whatsapp";


export class AppRouter {
  private router = express.Router()

  public routers(){
    /**
     * @swagger
     * /:
     *   get:
     *     summary: Home
     *     responses:
     *       200:
     *         description: Hello Word para verificar status da API
     *         content:
     *           application/json:
     *             schema:
     *               type: string
     *               items:
     *                 type: object
     *                 example: Ola Mundo
     */

    this.router.get("/", (req, res) => {
        res.send("Ola Mundo");
    });

    return this.router;
  }
}