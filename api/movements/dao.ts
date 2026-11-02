import { ClientSession } from "mongoose";
import { Movements } from "./model";
import { IRegisterMovementDao } from "./types";

const movementsDao = {
  create: async (data: IRegisterMovementDao, session: ClientSession) => {
    const [movement] = await Movements.create([data], { session });
    return movement;
  },

  index: (accountId: string, skip: number, limit: number) =>
    Movements.find({ account: accountId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("counterpartAccount", "alias cvu"),

  count: () => Movements.countDocuments(),
};

export default movementsDao;
