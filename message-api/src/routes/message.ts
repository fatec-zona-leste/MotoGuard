import express, { Request, Response } from "express";
import { WhatsApp } from "../whatsapp";


export class MessageRouter {
  public wp: WhatsApp;
  private router = express.Router()

  public constructor(wp: WhatsApp){
    this.wp = wp;
  }

  public routers(){
    /**
   * @swagger
   * /api/message:
   *   post:
   *     summary: Envia alerta via WhatsApp
   *     description: Envia uma mensagem de texto para um número específico no formato internacional.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - number
   *               - message
   *             properties:
   *               number:
   *                 type: string
   *                 example: "5511999999999"
   *               message:
   *                 type: string
   *                 example: "Atenção🏍️\nAcidente detectado com ..."
   *     responses:
   *       200:
   *         description: Mensagem enviada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Mensagem enviada
   *       400:
   *         description: Número ou mensagem não fornecidos
   *       500:
   *         description: Erro ao enviar mensagem
   */

    this.router.post('/', async (req: Request, res: Response) => {
      const { number, message } = req.body;
      if (!number || !message) {
        return res.status(400).json({ error: 'Número e mensagem são obrigatórios' });
      }

      try {
        await this.wp.client.sendMessage(`${number}@c.us`, message);
        res.json({ status: 'Mensagem enviada' });
      } catch (err: any) {
        res.status(500).json({ error: 'Erro ao enviar mensagem', details: err.message });
      }
    });

    return this.router;
  }
}