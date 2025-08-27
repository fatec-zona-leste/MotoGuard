import { Router } from "express";
import { login, register, update } from "../services/auth-service";
import { authenticate } from "../middlewares/auth-middleware";
import { validate } from "../utils/validation";

const router = Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags:
 *       - Usuários
 *     summary: Login de usuário
 *     description: Realiza login de um usuário existente e retorna um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "jonas@gmail.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Jonas Silva"
 *                     email:
 *                       type: string
 *                       example: "jonas@gmail.com"
 *                     picture:
 *                       type: string
 *                       example: "default.png"
 *       400:
 *         description: Erros de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *             example:
 *               - email: "Informe seu email"
 *               - password: "Informe sua senha"
 *       401:
 *         description: Erros de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *             example:
 *               - password: "Email e/ou senha inválidos"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro inesperado"
 */

const schemeLogin = {
  email: {
    required: "Informe seu email",
  },
  password: {
    required: "Informe sua senha",
  },
}
router.post("/login", validate(schemeLogin), login);

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags:
 *       - Usuários
 *     summary: Registra um novo usuário
 *     description: Registra um novo usuário com email e senha.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jonas Silva"
 *               email:
 *                 type: string
 *                 example: "jonas@gmail.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário criado"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Jonas Silva"
 *                     email:
 *                       type: string
 *                       example: "jonas@gmail.com"
 *                     picture:
 *                       type: string
 *                       example: "default.png"
 *                     createdAt:
 *                       type: string
 *                       example: "2024-06-01T12:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2024-06-01T12:00:00Z"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Erros de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *               example:
 *                 - name: "Informe seu nome"
 *                 - email: "Informe seu email"
 *                 - password: "O campo password deve ter no mínimo 8 caracteres"
 *       500:
 *         description: Erro ao criar usuário
 */

const schemeRegister = {
  name: {
    required: "Informe seu nome",
  },
  email: {
    required: "Informe seu email",
    type: "email",
  },
  password: {
    required: "Informe sua senha",
    min: 8,
  },
}
router.post("/register", validate(schemeRegister), register);

/**
 * @swagger
 * /api/users:
 *   patch:
 *     summary: Atualiza um usuário
 *     description: Atualiza os dados de um usuário existente.
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jonas Silva"
 *               email:
 *                 type: string
 *                 example: "jonas@gmail.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *               password_confirmation:
 *                 type: string
 *                 example: "12345678"
 *               picture:
 *                 type: string
 *                 example: "default.png"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário atualizado"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Jonas Silva"
 *                     email:
 *                       type: string
 *                       example: "jonas@gmail.com"
 *                     picture:
 *                       type: string
 *                       example: "default.png"
 *       400:
 *         description: Dados inválidos ou email já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *             example:
 *               - email: "Email já cadastrado"
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token inválido ou ausente"
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro inesperado"
 */

const schemeUpdate = {
  name: {
    required: "Informe seu nome",
  },
  email: {
    required: "Informe seu email",
    type: "email",
  },
  password_confirmation: {
    required: "Informe sua confirmação de senha",
  },
  password: {
    required: "Informe sua senha",
  },
}
router.patch("/users", [authenticate, validate(schemeUpdate)], update);

export default router;