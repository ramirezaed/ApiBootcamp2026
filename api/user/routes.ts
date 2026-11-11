import userController from "./controller";
import express from "express";
import { auth } from "../../middleware/auth";
import { isAdmin } from "../../middleware/isAdmin";

const userRoutes = express.Router();

const { create, show, index, destroy, update } = userController;

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
 * /users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     description: Obtiene los datos de un usuario específico por su ID. Requiere autenticación.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario.
 *         example: 672a1b2c3d4e5f6789012345
 *     responses:
 *       200:
 *         description: Usuario encontrado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Información del usuario.
 *       401:
 *         description: No autenticado o token inválido.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
userRoutes.get("/:id", auth, isAdmin, show);

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
 *       400:
 *         description: La cuenta se encuentra con dinero disponible
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

export default userRoutes;
