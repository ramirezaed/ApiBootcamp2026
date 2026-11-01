import express from "express";
import accountsController from "./controller";
import { auth } from "../../middleware/auth";
import { isAdmin } from "../../middleware/isAdmin";
const accountsRoutes = express.Router();

const { index, show, updateAlias, deposit, transfer } = accountsController;

/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Obtener todas las cuentas
 *     description: Obtiene un listado paginado de todas las cuentas registradas. Requiere autenticación y permisos de administrador.
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: Cantidad de cuentas por página
 *     responses:
 *       200:
 *         description: Cuentas obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accounts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Información de una cuenta
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *       401:
 *         description: No autorizado. Token faltante, inválido o expirado
 *       403:
 *         description: No tenés permisos de administrador
 *       500:
 *         description: Error interno del servidor
 */
accountsRoutes.get("/", auth, isAdmin, index);

/**
 * @swagger
 * /accounts/me:
 *   get:
 *     summary: Obtener mi cuenta
 *     description: Obtiene la cuenta asociada al usuario autenticado mediante su token JWT.
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cuenta obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "672a1234567890abcdef1234"
 *                 user:
 *                   type: string
 *                   example: "672a1234567890abcdef5678"
 *                 balance:
 *                   type: number
 *                   example: 15000
 *       401:
 *         description: No autorizado. Token faltante, inválido o expirado
 *       404:
 *         description: Cuenta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
accountsRoutes.get("/me", auth, show);

/**
 * @swagger
 * /accounts/alias:
 *   patch:
 *     summary: Actualizar alias de mi cuenta
 *     description: Permite al usuario autenticado modificar el alias de su cuenta, siempre que no esté siendo utilizado por otra cuenta.
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - alias
 *             properties:
 *               alias:
 *                 type: string
 *                 example: admin.banco
 *                 description: Nuevo alias de la cuenta
 *     responses:
 *       200:
 *         description: Alias actualizado correctamente
 *       401:
 *         description: No autorizado. Token faltante, inválido o expirado
 *       404:
 *         description: Cuenta no encontrada
 *       409:
 *         description: El alias ya se encuentra en uso
 *       500:
 *         description: Error interno del servidor
 */
accountsRoutes.patch("/alias", auth, updateAlias);

/**
 * @swagger
 * /accounts/deposit:
 *   patch:
 *     summary: Depositar dinero en mi cuenta
 *     description: Permite al usuario autenticado realizar un depósito en su cuenta. El monto debe ser mayor a cero.
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 5000
 *                 description: Monto que se desea depositar
 *     responses:
 *       200:
 *         description: Depósito realizado correctamente
 *       400:
 *         description: El monto debe ser mayor a 0
 *       401:
 *         description: No autorizado. Token faltante, inválido o expirado
 *       404:
 *         description: Cuenta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
accountsRoutes.patch("/deposit", auth, deposit);

/**
 * @swagger
 * /accounts/transfer:
 *   patch:
 *     summary: Realizar una transferencia
 *     description: Transfiere dinero desde la cuenta del usuario autenticado hacia otra cuenta mediante su CVU o alias. La operación se realiza dentro de una transacción de MongoDB.
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - destination
 *               - amount
 *             properties:
 *               destination:
 *                 type: string
 *                 example: "admin.banco"
 *                 description: CVU o alias de la cuenta destinataria
 *               amount:
 *                 type: number
 *                 exclusiveMinimum: 0
 *                 example: 5000
 *                 description: Monto que se desea transferir
 *     responses:
 *       200:
 *         description: Transferencia realizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transferencia realizada correctamente"
 *                 amount:
 *                   type: number
 *                   example: 5000
 *                 origin:
 *                   type: object
 *                   description: Información de la cuenta de origen actualizada
 *                 destination:
 *                   type: object
 *                   description: Información de la cuenta de destino actualizada
 *       400:
 *         description: Monto inválido, saldo insuficiente, transferencia a la misma cuenta o error al acreditar
 *       401:
 *         description: No autorizado. Token faltante, inválido o expirado
 *       404:
 *         description: Cuenta de origen o destino no encontrada
 *       500:
 *         description: Error interno del servidor
 */
accountsRoutes.patch("/transfer", auth, transfer);

export default accountsRoutes;
