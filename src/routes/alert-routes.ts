import { Router } from "express";
import { authenticate } from "../middlewares/auth-middleware";
import { validate } from "../utils/validation";
import { register } from "../services/alert-service";

const router = Router();

/**
 * @swagger
 * /api/alerts:
 *   post:
 *     tags:
 *       - Alerta
 *     summary: Envia alerta para o contato de emergência
 *     description: Caso o usuário tenha um contato de emergência cadastro e o IoT detecte impacto, é enviado a localização para o contato de emergência
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - device_id
 *               - latitude
 *               - longitude
 *             properties:
 *               device_id:
 *                 type: number
 *                 example: 1
 *               latitude:
 *                 type: number
 *                 example: -23.5476
 *               longitude:
 *                 type: number
 *                 example: -46.5042
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Alerta enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Alerta enviado"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *               example:
 *                 errors:
 *                   device_id: "Informe o id do dispositivo"
 *                   latitude: "O campo latitude deve ser no mínimo -90"
 *                   longitude: "O campo longitude deve ser no mínimo -180"
 *       403:
 *         description: Acesso negado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Acesso negado"
 *       404:
 *         description: Dispositivo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Dispositivo não encontrado"
 */


const schemeRegister = {
    device_id: {
        required: "Informe o id do dispositivo"
    },
    latitude: {
        required: "Informe a latitude do dispositivo",
        min: -90,
        max: 90
    },
    longitude: {
        required: "Informe a longitude do dispositivo",
        min: -180,
        max: 180
    }
}

router.post("", authenticate, validate(schemeRegister), register)

export default router;