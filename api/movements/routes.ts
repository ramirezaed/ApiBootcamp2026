import express from "express";
import { auth } from "../../middleware/auth";
import movementsController from "./controller";

const movementsRoutes = express.Router();

const { index } = movementsController;

/**
 * @swagger
 * /movements/me:
 *   get:
 *     summary: Obtener movimientos de mi cuenta
 *     description: Obtiene los movimientos asociados a la cuenta del usuario autenticado, con paginación.
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Número de página.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: Cantidad de movimientos por página.
 *     responses:
 *       200:
 *         description: Movimientos obtenidos correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movements:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Información del movimiento.
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
 *         description: No autenticado o token inválido.
 *       404:
 *         description: Cuenta no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
movementsRoutes.get("/me", auth, index);

export default movementsRoutes;
