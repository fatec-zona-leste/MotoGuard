import express, { Request, Response } from "express";
import { sendEmergencyMessage } from "../services/message-service";
import { authenticate, authorizeAdmin } from "../middlewares/auth-middleware";
import { wpClient } from "../messages/WhatsApp";

const router = express.Router();

/**
 * @swagger
 * /api/message/authenticate:
 *   get:
 *     tags:
 *       - WhatsApp
 *     summary: Obtém o QR code para autenticação do WhatsApp
 *     description: Retorna uma imagem HTML contendo o QR code necessário para vincular o WhatsApp Web ao bot.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário já autenticado ou QR code gerado
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<img src='data:image/png;base64,...'>"
 *       404:
 *         description: QR code ainda não gerado
 */
router.get("/message/authenticate", authenticate, authorizeAdmin, (req, res) => {
    if (wpClient.client.info) 
        return res.status(200).json({ message: "Já autenticado no WhatsApp" });

    if (!wpClient.getQrCodeData())
        return res.status(404).send("QR code ainda não gerado");

    res.send(`<img src="${wpClient.getQrCodeData()}">`);
});

/**
 * @swagger
 * /api/message/logout:
 *   post:
 *     tags:
 *       - WhatsApp
 *     summary: Faz logout do WhatsApp
 *     description: Encerra a sessão atual e remove a autenticação local do WhatsApp.
 *     security:
 *       - bearerAuth: []
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao realizar logout"
 *                 error:
 *                   type: string
 *                   example: "Detalhes do erro"
 */
router.post("/message/logout", authenticate, authorizeAdmin, async (req, res) => {
    try {
        await wpClient.client.logout();
        res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch (err) {
        res.status(500).json({message: "Erro ao realizar logout", error: err instanceof Error ? err.message : err });
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
 *     security:
 *       - bearerAuth: []
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
router.post('/message', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    try {
        await sendEmergencyMessage(req, res); // aqui continua enviando a resposta
    } catch (err) {
        res.status(500).json({ message: err instanceof Error ? err.message : "Erro ao enviar mensagem" });
    }
});

export default router;
