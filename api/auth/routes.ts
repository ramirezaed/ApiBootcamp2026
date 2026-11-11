import userController from "./controller";
import express from "express";
import { auth } from "../../middleware/auth";

import authController from "./controller";

const authRoutes = express.Router();

const { login, changePassword, me } = authController;

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica al usuario mediante email y contraseña y devuelve un token JWT.
 *     tags:
 *       - Users
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
 *                 format: email
 *                 example: admin@gmail.com
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 example: "12345678"
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payload:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "672a1234567890abcdef1234"
 *                     isAdmin:
 *                       type: boolean
 *                       example: true
 *                 accessToken:
 *                   type: string
 *                   description: Token JWT para autenticar futuras solicitudes
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error interno del servidor
 */
authRoutes.post("/", login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtener mi perfil
 *     description: Obtiene los datos del usuario autenticado mediante su token JWT.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "672a1234567890abcdef1234"
 *                 name:
 *                   type: string
 *                   example: admin
 *                 lastname:
 *                   type: string
 *                   example: administrador
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: admin@gmail.com
 *                 isAdmin:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: No autorizado. Token faltante, inválido o expirado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
authRoutes.get("/me", auth, me);

/**
 * @swagger
 * /auth/me/password:
 *   patch:
 *     summary: Cambiar mi contraseña
 *     description: Permite al usuario autenticado cambiar su contraseña verificando primero la contraseña actual.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "01234567"
 *                 description: Contraseña actual del usuario
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 example: "12345678"
 *                 description: Nueva contraseña (mínimo 8 caracteres)
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contraseña Actualizada"
 *       400:
 *         description: La nueva contraseña debe tener al menos 8 caracteres
 *       401:
 *         description: No autorizado o contraseña actual incorrecta
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
authRoutes.patch("/me/password", changePassword);

export default authRoutes;
