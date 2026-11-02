import accountsDao from "./dao";
import { IRegisterAccountDao } from "./types";
import { HttpError } from "../../errors/HttpError";
import mongoose, { ClientSession } from "mongoose";
import movementsDao from "../movements/dao";

const accountsService = {
  async index(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [accounts, total] = await Promise.all([
      //Ejecuta las dos consultas en paralelo
      accountsDao.index(skip, limit),
      accountsDao.count(),
    ]);
    return {
      accounts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async create(data: IRegisterAccountDao) {
    const [isCvuTaken, isAliasTaken] = await Promise.all([
      //Ejecuta las dos consultas en paralelo
      accountsDao.findByCvu(data.cvu),
      accountsDao.findByAlias(data.alias),
    ]);

    if (isAliasTaken || isCvuTaken)
      throw new HttpError(409, "El Alias o CVU ya se encuentra en uso");
    return await accountsDao.register(data);
  },

  async findByUser(userId: string) {
    const accountExists = await accountsDao.findByUser(userId);
    if (!accountExists) throw new HttpError(404, "Recurso no encontrado");
    return accountExists;
  },

  async UpdateAlias(userId: string, alias: string) {
    const account = await accountsDao.findByUser(userId);
    if (!account) throw new HttpError(404, "recurso no encontrado");
    const aliasExists = await accountsDao.findByAlias(alias);
    if (aliasExists)
      throw new HttpError(409, "El alias ya se encuentra en uso");

    return await accountsDao.updateAlias(userId, alias);
  },

  async deposit(userId: string, amount: number) {
    const account = await accountsDao.findByUser(userId);
    if (!account) throw new HttpError(404, "Recurso no encontrado");
    if (amount <= 0) throw new HttpError(400, "El monto debe ser mayor a 0");

    const session = await mongoose.startSession();

    try {
      let updatedAccount;

      await session.withTransaction(async () => {
        updatedAccount = await accountsDao.deposit(userId, amount, session);

        await movementsDao.create(
          {
            type: "deposit",
            account: account._id,
            amount,
            balanceBefore: account.balance,
            balanceAfter: account.balance + amount,
          },
          session,
        );
      });

      return updatedAccount;
    } finally {
      await session.endSession();
    }
  },

  async debit(userId: string, amount: number) {
    const account = await accountsDao.findByUser(userId);
    if (!account) throw new HttpError(404, "Recurso no encontrado");
    if (amount > account.balance)
      throw new HttpError(400, "Saldo insuficiente");

    const session = await mongoose.startSession();

    try {
      let updatedAccount;
      await session.withTransaction(async () => {
        updatedAccount = await accountsDao.debit(userId, amount, session);
      });
      return updatedAccount;
    } finally {
      await session.endSession();
    }
  },

  async transfer(userId: string, destination: string, amount: number) {
    if (amount <= 0) throw new HttpError(400, "Monto debe ser mayor a 0");

    const session = await mongoose.startSession();

    try {
      let result;

      await session.withTransaction(async () => {
        // Cuenta de quien envía
        const origin = await accountsDao.findByUser(userId);
        if (!origin) throw new HttpError(404, "Cuenta de origen no encontrada");

        // Cuenta de quien recibe (por CVU o alias)
        const destinationAccount =
          (await accountsDao.findByCvu(destination)) ??
          (await accountsDao.findByAlias(destination));
        if (!destinationAccount)
          throw new HttpError(404, "Cuenta de destino no encontrada");

        if (origin._id.equals(destinationAccount._id))
          throw new HttpError(400, "No podés transferirte a vos mismo");

        // Descontar de cuenta origen
        const debit = await accountsDao.debit(userId, amount, session);
        if (!debit) throw new HttpError(400, "Saldo insuficiente");

        // Acreditar al destinatario
        const credit = await accountsDao.credit(
          destinationAccount.user.toString(),
          amount,
          session,
        );
        if (!credit) throw new HttpError(400, "No se pudo acreditar el dinero");

        // Registrar las 2 cuentas del movimiento
        const transferId = new mongoose.Types.ObjectId();

        await movementsDao.create(
          {
            type: "transfer",
            account: origin._id,
            amount,
            transferId,
            counterpartAccount: destinationAccount._id,
            balanceBefore: origin.balance,
            balanceAfter: origin.balance - amount,
          },
          session,
        );

        await movementsDao.create(
          {
            type: "transfer",
            account: destinationAccount._id,
            amount,
            transferId,
            counterpartAccount: origin._id,
            balanceBefore: destinationAccount.balance,
            balanceAfter: destinationAccount.balance + amount,
          },
          session,
        );

        result = {
          message: "Transferencia realizada correctamente",
          amount,
          origin: debit,
          destination: credit,
        };
      });

      return result;
    } finally {
      await session.endSession();
    }
  },

  async destroy(userId: string, session: ClientSession) {
    const accountExists = await accountsDao.findByUser(userId);
    if (!accountExists) throw new HttpError(404, "Recurso no encontrado");
    if (accountExists.balance > 0)
      throw new HttpError(400, "La cuenta se encuentra con dinero disponible");
    return await accountsDao.destroy(userId, session);
  },
};

export default accountsService;
