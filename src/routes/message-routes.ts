import express from "express";
import {  authenticateWhatsApp, logoutWhatsApp } from "../services/message-service";
import { authenticate, authorizeAdmin } from "../middlewares/auth-middleware";

const router = express.Router();

/**
 * @swagger
 * /api/messages/authenticate:
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
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *               example: "<img src='data:image/png;base64,...'>"
 *       404:
 *         description: QR code ainda não gerado
 */
router.get("/authenticate", authenticate, authorizeAdmin, authenticateWhatsApp);

/**
 * @swagger
 * /api/messages/logout:
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
router.post("/logout", authenticate, authorizeAdmin, logoutWhatsApp);

export default router;
