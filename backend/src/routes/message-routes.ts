import express, { Request, Response } from "express";
import { sendEmergencyMessage } from "../services/message-service";
import { WhatsApp } from "../messages/WhatsApp";

const router = express.Router();
const wp = new WhatsApp();

/**
 * @swagger
 * /api/message/authenticate:
 *   get:
 *     tags:
 *       - WhatsApp
 *     summary: Obtém o QR code para autenticação do WhatsApp
 *     description: Retorna uma imagem HTML contendo o QR code necessário para vincular o WhatsApp Web ao bot.
 *     responses:
 *       200:
 *         description: HTML com o QR code
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<img src='data:image/png;base64,...'>"
 *       404:
 *         description: QR code ainda não gerado
 */
router.get("/message/authenticate", (req, res) => {
    // já está logado → não precisa de QR
    if (wp.client.info) 
        return res.status(200).json({message: "Já autenticado no WhatsApp"});
    
    if (!wp.getQrCodeData())
        return res.status(404).send("QR code ainda não gerado");
    
    res.send(`<img src="${wp.getQrCodeData()}">`);
});


/**
 * @swagger
 * /api/message/logout:
 *   post:
 *     tags:
 *       - WhatsApp
 *     summary: Faz logout do WhatsApp
 *     description: Encerra a sessão atual e remove a autenticação local.
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout realizado com sucesso"
 *       500:
 *         description: Erro ao realizar logout
 */
router.post("/message/logout", async (req, res) => {
    try {
        await wp.client.logout();
        res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch (err) {
        res.status(500).json({ message: "Erro ao realizar logout", error: err instanceof Error ? err.message : err });
    }
});

/**
 * @swagger
 * /api/message:
 *   post:
 *     tags:
 *       - WhatsApp
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
router.post('/message', async (req: Request, res: Response) => {
    return sendEmergencyMessage(req, res);
});

export default router;
