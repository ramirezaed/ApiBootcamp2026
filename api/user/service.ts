import userDao from "./dao";
import bcrypt from "bcrypt";
import { compare } from "bcrypt";
import { ILogin, IRegisterUserDao, IUpdateUserDao } from "./types";
import { HttpError } from "../../errors/HttpError";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import accountRegistrationService from "../../service/createAccount";
import accountsDao from "../account/dao";

const userService = {
  async create(data: IRegisterUserDao) {
    const isEmailTaken = await userDao.findbyEmail(data.email);
    if (isEmailTaken) throw new HttpError(409, "El email ya está registrado");
    if (data.password.length < 8)
      throw new HttpError(
        400,
        "La contraseña debe tener al menos 8 caracteres",
      );

    const password = await bcrypt.hash(data.password, 10);
    const newUser = await userDao.register({ ...data, password });

    await accountRegistrationService.create(newUser._id.toString()); //crea la cuenta al crear el usuario

    const { password: _, ...userWithoutPassword } = newUser.toObject(); //devolver usuario sin password
    return userWithoutPassword;
  },

  async findById(id: string) {
    const userExists = await userDao.findByid(id);
    if (!userExists) throw new HttpError(404, "Recurso no encotrado");
    return userExists;
  },

  async index(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      //Ejecuta las dos consultas en paralelo
      userDao.index(skip, limit),
      userDao.count(),
    ]);
    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit), //redondea hacia arriba
      },
    };
  },
  async update(id: string, data: IUpdateUserDao) {
    const userExists = await userDao.findByid(id);
    if (!userExists) throw new HttpError(404, "Recurso no encontrado");

    if (data.email) {
      const isEmailTaken = await userDao.findbyEmail(data.email);
      if (isEmailTaken) {
        throw new HttpError(
          409,
          "El email ya está registrado por otro usuario",
        );
      }
    }
    const updatedUser = await userDao.update(id, data);
    return updatedUser;
  },

  async destroy(id: string) {
    const session = await mongoose.startSession();
    try {
      const user = await session.withTransaction(async () => {
        const destroyed = await userDao.destroy(id, session);
        if (!destroyed) throw new HttpError(404, "Recurso no encontrado");
        await accountsDao.destroy(id, session);
        return destroyed;
      });
      return { message: "Usuario Eliminado" };
    } finally {
      await session.endSession();
    }
  },

  async login(data: ILogin) {
    const user = await userDao.findByEmailWithPassword(data.email);
    if (!user) throw new HttpError(400, "Credenciales incorrectas");

    const isPasswordValid = await compare(data.password, user.password);
    if (!isPasswordValid) throw new HttpError(400, "Credenciales incorrectas");

    const payload = {
      _id: user.id,
      isAdmin: user.isAdmin,
    };

    const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET!); //el token no expira

    return { payload, accessToken };
  },

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await userDao.findUserWithPassword(id);
    if (!user) throw new HttpError(404, "Recurso no encontrado");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new HttpError(401, "Contraseña actual incorrecta");

    const password = await bcrypt.hash(newPassword, 10);

    await userDao.changePassword(id, password);

    return { message: "Contraseña Actualizada" };
  },
};

export default userService;
