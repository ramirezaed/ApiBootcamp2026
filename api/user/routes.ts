import userController from "./controller";
import express from "express";
import { auth } from "../../middleware/auth";
import { isAdmin } from "../../middleware/isAdmin";

const userRoutes = express.Router();

const { create, show, index, destroy, update, login, changePassword } =
  userController;

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Obtiene un listado paginado de usuarios. Requiere autenticación y permisos de administrador.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de usuarios por página
 *     responses:
 *       200:
 *         description: Usuarios obtenidos correctamente
 *       401:
 *         description: No autorizado. Token faltante, inválido o expirado
 *       403:
 *         description: No tenés permisos de administrador
 *       500:
 *         description: Error interno del servidor
 */
userRoutes.get("/", auth, isAdmin, index);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Registrar un usuario
 *     description: Registra un nuevo usuario y crea automáticamente su cuenta.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - lastname
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: admin
 *                 description: Nombre del usuario
 *               lastname:
 *                 type: string
 *                 example: administrador
 *                 description: Apellido del usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@gmail.com
 *                 description: Correo electrónico único
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "12345678"
 *                 description: Contraseña de al menos 8 caracteres
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente y cuenta creada
 *       400:
 *         description: Datos inválidos o contraseña menor a 8 caracteres
 *       409:
 *         description: El email ya está registrado
 *       500:
 *         description: Error interno del servidor
 */
userRoutes.post("/", create);

/**
 * @swagger
 * /users/me:
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
userRoutes.get("/me", auth, show);

/**
 * @swagger
 * /users/me/password:
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
userRoutes.patch("/me/password", auth, changePassword);

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Eliminar mi usuario
 *     description: Elimina el usuario autenticado y su cuenta asociada mediante una transacción de MongoDB.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario y cuenta eliminados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario Eliminado"
 *       401:
 *         description: No autorizado. Token faltante, inválido o expirado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
userRoutes.delete("/", auth, destroy);

/**
 * @swagger
 * /users:
 *   patch:
 *     summary: Actualizar mi perfil
 *     description: Permite al usuario autenticado actualizar sus datos personales.
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alejandro
 *                 description: Nuevo nombre del usuario
 *               lastname:
 *                 type: string
 *                 example: Ramirez
 *                 description: Nuevo apellido del usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alejandro@gmail.com
 *                 description: Nuevo correo electrónico
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       401:
 *         description: No autorizado. Token faltante, inválido o expirado
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: El email ya está registrado por otro usuario
 *       500:
 *         description: Error interno del servidor
 */
userRoutes.patch("/", auth, update);

/**
 * @swagger
 * /users/auth:
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
userRoutes.post("/auth", login);

export default userRoutes;
