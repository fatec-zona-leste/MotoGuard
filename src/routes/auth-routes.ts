import { Router } from "express";
import { destroy, login, register, update, updatePassword, updateProfile, validateEmail } from "../services/auth-service";
import { authenticate } from "../middlewares/auth-middleware";
import { validate } from "../utils/validation";

const router = Router();
/**
 * @swagger
 * /api/users/login:
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
 *               type: object
 *               properties:
 *                 errors:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *             example:
 *               errors:
 *                 email: "Informe seu email"
 *                 password: "Informe sua senha"
 *       401:
 *         description: Email e/ou senha inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: string
 *             example:
 *               password: "Email e/ou senha inválidos"
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
 * /api/users:
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
 *               emergency_number:
 *                 type: string
 *                 example: "5511946225632"
 *                 nullable: true
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
 *               type: object
 *               properties:
 *                 errors:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *               example:
 *                 errors:
 *                   name: "Informe seu nome"
 *                   email: "Informe seu email"
 *                   password: "O campo password deve ter no mínimo 8 caracteres"
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
  emergency_number: {
    min: 13,
    max: 13,
  },
}
router.post("", validate(schemeRegister), register);

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
 *               emergency_number:
 *                 type: string
 *                 example: "5511946225632"
 *                 nullable: true
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
 *         description: Erros de validação
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
 *                   name: "Informe seu nome"
 *                   email: "Informe seu email"
 *                   password: "O campo password deve ter no mínimo 8 caracteres"
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
  emergency_number: {
    min: 13,
    max: 13,
  },
}
router.patch("", [authenticate, validate(schemeUpdate)], update);

/**
 * @swagger
 * /api/users/info:
 *   patch:
 *     summary: Atualiza dados do usuário
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
 *         description: Erros de validação
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
 *                   name: "Informe seu nome"
 *                   email: "Informe seu email"
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

const schemeUpdatePassword = {
  old_password: {
    required: "Informe sua senha atual",
  },
  password: {
    required: "Informe sua nova senha",
    min: 8,
  },
}
router.patch("/info", [authenticate, validate(schemeUpdatePassword)], updatePassword);

/**
 * @swagger
 * /api/users/info:
 *   patch:
 *     summary: Atualiza dados do usuário
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
 *         description: Erros de validação
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
 *                   name: "Informe seu nome"
 *                   email: "Informe seu email"
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

const schemeUpdateInfo = {
  name: {
    required: "Informe seu nome",
  },
  email: {
    required: "Informe seu email",
    type: "email",
  },
}
router.patch("/info", [authenticate, validate(schemeUpdateInfo)], updateProfile);

/**
 * @swagger
 * /api/users/validate-email:
 *   post:
 *     summary: Verifica se e-mail já está em uso
 *     description: Verifica se um e-mail já está cadastrado no sistema.
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "jonas@gmail.com"
 *     responses:
 *       200:
 *         description: E-mail não cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: E-mail não cadastrado
 *       400:
 *         description: Erros de validação
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
 *                   email: "Informe seu email"
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

const schemeValidateEmail = {
  email: {
    required: "Informe seu email",
    type: "email",
  },
}
router.post("/validate-email", [validate(schemeValidateEmail)], validateEmail);


/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     description: Remove um usuário.
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser removido
 *     responses:
 *       200:
 *         description: Conta excluída
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "IMPACT_SENSOR"
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.delete("/:id", authenticate, destroy);


export default router;