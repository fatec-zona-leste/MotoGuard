import express from "express";
import {  authenticateWhatsApp, logoutWhatsApp, sendEmergencyMessage } from "../services/message-service";
import { authenticate, authorizeAdmin } from "../middlewares/auth-middleware";

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
router.get("/message/authenticate", authenticate, authorizeAdmin, authenticateWhatsApp);

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
router.post("/message/logout", authenticate, authorizeAdmin, logoutWhatsApp);

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
router.post('/message', authenticate, authorizeAdmin, sendEmergencyMessage);

export default router;
