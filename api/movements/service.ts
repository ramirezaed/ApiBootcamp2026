import movementsDao from "./dao";
import { HttpError } from "../../errors/HttpError";
import accountsService from "../account/service";

const movementsService = {
  async indexByUser(userId: string, page: number, limit: number) {
    const account = await accountsService.findByUser(userId);
    if (!account) throw new HttpError(404, "Recurso no encontrado");

    const skip = (page - 1) * limit;
    const [movements, total] = await Promise.all([
      movementsDao.index(account._id.toString(), skip, limit),
      movementsDao.count(),
    ]);

    return {
      movements,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};

export default movementsService;
