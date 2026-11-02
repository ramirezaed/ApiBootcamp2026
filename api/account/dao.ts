import { ClientSession } from "mongoose";
import { Accounts } from "./model";
import { IRegisterAccountDao } from "./types";

const accountsDao = {
  index: (skip: number, limit: number) =>
    Accounts.find({ deletedAt: null })
      .skip(skip)
      .limit(limit)
      .populate("user", "name lastname"),
  count: () => Accounts.countDocuments({ deletedAt: null }),

  findById: (id: string) => Accounts.findById({ id, deletedAt: null }),

  register: (accounts: IRegisterAccountDao) => Accounts.create(accounts),

  findByAlias: (alias: string) => Accounts.findOne({ alias }),
  findByCvu: (cvu: string) => Accounts.findOne({ cvu }),

  findByUser: (userId: string) =>
    Accounts.findOne({ user: userId, deletedAt: null }),

  updateAlias: (userId: string, alias: string) =>
    Accounts.findOneAndUpdate(
      {
        user: userId,
        deletedAt: null,
      },
      { $set: { alias } },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ),

  deposit: (userId: string, amount: number, session: ClientSession) =>
    Accounts.findOneAndUpdate(
      {
        user: userId,
        deletedAt: null,
      },
      {
        $inc: { balance: amount },
      },
      {
        returnDocument: "after",
        runValidators: true,
        session,
      },
    ),

  //Descontar dinero
  debit: (userId: string, amount: number, session: ClientSession) =>
    Accounts.findOneAndUpdate(
      {
        user: userId,
        deletedAt: null,
        balance: { $gte: amount }, // Comprueba que tenga saldo suficiente
      },
      {
        $inc: { balance: -amount }, // Descuenta el dinero
      },
      {
        returnDocument: "after",
        runValidators: true,
        session,
      },
    ),
  //Agregar dinero
  credit: (userId: string, amount: number, session: ClientSession) =>
    Accounts.findOneAndUpdate(
      {
        user: userId,
        deletedAt: null,
      },
      {
        $inc: { balance: amount },
      },
      {
        returnDocument: "after",
        runValidators: true,
        session,
      },
    ),

  destroy: (userId: string, session: ClientSession) =>
    Accounts.findOneAndUpdate(
      { user: userId, deletedAt: null },
      { deletedAt: new Date() },
      { session },
    ),
};

export default accountsDao;
