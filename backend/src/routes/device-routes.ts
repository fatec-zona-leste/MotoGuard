import express from "express";
import { authenticate, AuthRequest } from "../middlewares/auth-middleware";
import { destroy, index, register, update } from "../services/device-service";

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
 *                       bluetooth_name:
 *                         type: string
 *                         example: "Sensor Impacto"
 *                       service_uuid:
 *                         type: string
 *                         example: "0000180f-0000-1000-8000-00805f9b34fb"
 *                       characteristic_uuid:
 *                         type: string
 *                         example: "00002a19-0000-1000-8000-00805f9b34fb"
 *                       type:
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
 *     description: Cadastra um dispositivo associado ao usuário autenticado. Se o dispositivo já existe, atualiza seus dados.
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
 *               - bluetooth_name
 *               - service_uuid
 *               - characteristic_uuid
 *               - type
 *             properties:
 *               bluetooth_name:
 *                 type: string
 *                 example: "Sensor Impacto"
 *                 description: Nome do dispositivo Bluetooth
 *               service_uuid:
 *                 type: string
 *                 example: "0000180f-0000-1000-8000-00805f9b34fb"
 *               characteristic_uuid:
 *                 type: string
 *                 example: "00002a19-0000-1000-8000-00805f9b34fb"
 *               type:
 *                 type: string
 *                 enum:
 *                   - IMPACT_SENSOR
 *                   - RIGHT_SENSOR
 *                   - LEFT_SENSOR
 *                   - REAR_SENSOR
 *                 description: Tipo do sensor do dispositivo
 *     responses:
 *       201:
 *         description: Sensor cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sensor cadastrado"
 *                 device:
 *                   $ref: '#/components/schemas/Device'
 *       200:
 *         description: Sensor já existia e foi atualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dispositivo atualizado"
 *                 device:
 *                   $ref: '#/components/schemas/Device'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao cadastrar ou atualizar dispositivo
 */

router.post("", authenticate, (req: AuthRequest, res) => {
  return register(req, res);
});

/**
 * @swagger
 * /api/devices:
 *   patch:
 *     summary: Atualiza um dispositivo existente
 *     description: Atualiza os dados de um dispositivo associado ao usuário autenticado.
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
 *               - id
 *               - bluetooth_name
 *               - service_uuid
 *               - characteristic_uuid
 *               - type
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *                 description: ID do dispositivo a ser atualizado
 *               bluetooth_name:
 *                 type: string
 *                 example: "Sensor Impacto"
 *                 description: Nome do dispositivo Bluetooth
 *               service_uuid:
 *                 type: string
 *                 example: "0000180f-0000-1000-8000-00805f9b34fb"
 *                 description: UUID do serviço do dispositivo
 *               characteristic_uuid:
 *                 type: string
 *                 example: "00002a19-0000-1000-8000-00805f9b34fb"
 *                 description: UUID da característica do dispositivo
 *               type:
 *                 type: string
 *                 enum:
 *                   - IMPACT_SENSOR
 *                   - RIGHT_SENSOR
 *                   - LEFT_SENSOR
 *                   - REAR_SENSOR
 *                 description: Tipo do sensor do dispositivo
 *     responses:
 *       200:
 *         description: Dispositivo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dispositivo atualizado"
 *                 device:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     bluetooth_name:
 *                       type: string
 *                       example: "Sensor Impacto"
 *                     service_uuid:
 *                       type: string
 *                     characteristic_uuid:
 *                       type: string
 *                     type:
 *                       type: string
 *                       example: "IMPACT_SENSOR"
 *                     user_id:
 *                       type: integer
 *                       example: 42
 *       404:
 *         description: Dispositivo não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao atualizar dispositivo
 */

router.patch("", authenticate, (req: AuthRequest, res) => {
  return update(req, res);
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

router.delete("/:id", authenticate, (req: AuthRequest, res) => {
  return destroy(req, res);
});

export default router;
