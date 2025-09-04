import express from "express";
import { authenticate } from "../middlewares/auth-middleware";
import { destroy, index, register, update } from "../services/device-service";
import { validate } from "../utils/validation";

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
router.get("", authenticate, index);

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
 *                   bluetooth_name: "Informe o nome do dispositivo"
 *                   service_uuid: "Informe o service UUID"
 *                   characteristic_uuid: "Informe o characteristic UUID"
 *                   type: "Informe o tipo do dispositivo"
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao cadastrar ou atualizar dispositivo
 */

const schemeRegister = {
  bluetooth_name: {
    required: "Informe o nome do dispositivo",
  },
  service_uuid: {
    required: "Informe o service UUID",
  },
  characteristic_uuid: {
    required: "Informe o characteristic UUID",
  },
  type: {
    required: "Informe o tipo do dispositivo",
  },
}
router.post("", authenticate, validate(schemeRegister), register);

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
 *                   id: "Informe o id do dispositivo"
 *                   bluetooth_name: "Informe o nome do dispositivo"
 *                   service_uuid: "Informe o service UUID"
 *                   characteristic_uuid: "Informe o characteristic UUID"
 *                   type: "Informe o tipo do dispositivo"
 *       404:
 *         description: Dispositivo não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao atualizar dispositivo
 */

const schemeUpdate = {
  id: {
    required: "Informe o id do dispositivo",
  },
  bluetooth_name: {
    required: "Informe o nome do dispositivo",
  },
  service_uuid: {
    required: "Informe o service UUID",
  },
  characteristic_uuid: {
    required: "Informe o characteristic UUID",
  },
  type: {
    required: "Informe o tipo do dispositivo",
  },
}
router.patch("", authenticate, validate(schemeUpdate), update);

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

router.delete("/:id", authenticate, destroy);

export default router;
