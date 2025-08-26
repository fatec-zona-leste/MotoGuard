import express from "express";
import { authenticate, AuthRequest } from "../middlewares/auth-middleware";
import { index, register } from "../services/device-service";

const router = express.Router();

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Lista dispositivos do usuário autenticado
 *     description: Retorna todos os dispositivos associados ao usuário autenticado.
 *     tags:
 *       - Dispositivos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sensores do usuário autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 devices:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       mac_address:
 *                         type: string
 *                         example: "00:1B:44:11:3A:B7"
 *                       sensor:
 *                         type: string
 *                         example: "IMPACT_SENSOR"
 *                       user_id:
 *                         type: integer
 *                         example: 42
 *       401:
 *         description: Não autorizado
 */
router.get("", authenticate, (req: AuthRequest, res) => {
  return index(req, res);
});

/**
 * @swagger
 * /api/devices:
 *   post:
 *     summary: Cadastra um novo dispositivo
 *     description: Esta rota permite cadastrar um dispositivo associado a um usuário autenticado.
 *     tags:
 *       - Dispositivos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mac_address
 *               - sensor
 *             properties:
 *               mac_address:
 *                 type: string
 *                 example: "00:1B:44:11:3A:B7"
 *                 description: Endereço MAC único do dispositivo
 *               sensor:
 *                 type: string
 *                 enum:
 *                   - IMPACT_SENSOR
 *                   - RIGHT_SENSOR
 *                   - LEFT_SENSOR
 *                   - REAR_SENSOR
 *                 description: Tipo do sensor do dispositivo
 *     responses:
 *       201:
 *         description: Sensor cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 mac_address:
 *                   type: string
 *                 user_id:
 *                   type: integer
 *                 sensor:
 *                   type: string
 *       400:
 *         description: Dados inválidos ou MAC já existente
 *       401:
 *         description: Não autorizado
 */

router.post("", authenticate, (req: AuthRequest, res) => {
  return register(req, res);
});

/**
 * @swagger
 * /api/devices:
 *   patch:
 *     summary: Atualiza um dispositivo
 *     description: Esta rota permite Atualizar um dispositivo associado a um usuário autenticado.
 *     tags:
 *       - Dispositivos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mac_address
 *               - sensor
 *             properties:
 *               mac_address:
 *                 type: string
 *                 example: "00:1B:44:11:3A:B7"
 *                 description: Endereço MAC único do dispositivo
 *               sensor:
 *                 type: string
 *                 enum:
 *                   - IMPACT_SENSOR
 *                   - RIGHT_SENSOR
 *                   - LEFT_SENSOR
 *                   - REAR_SENSOR
 *                 description: Tipo do sensor do dispositivo
 *     responses:
 *       201:
 *         description: Sensor Atualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 mac_address:
 *                   type: string
 *                 user_id:
 *                   type: integer
 *                 sensor:
 *                   type: string
 *       400:
 *         description: Dados inválidos ou MAC já existente
 *       401:
 *         description: Não autorizado
 */

router.put("", authenticate, (req: AuthRequest, res) => {
  return register(req, res);
});

/**
 * @swagger
 * /api/devices/{id}:
 *   delete:
 *     summary: Remove um dispositivo
 *     description: Remove um dispositivo associado ao usuário autenticado.
 *     tags:
 *       - Dispositivos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do dispositivo a ser removido
 *     responses:
 *       200:
 *         description: Dispositivo removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 mac_address:
 *                   type: string
 *                   example: "00:1B:44:11:3A:B7"
 *                 user_id:
 *                   type: integer
 *                   example: 42
 *                 sensor:
 *                   type: string
 *                   example: "IMPACT_SENSOR"
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Dispositivo não encontrado
 */

router.delete("", authenticate, (req: AuthRequest, res) => {
  return register(req, res);
});

export default router;
