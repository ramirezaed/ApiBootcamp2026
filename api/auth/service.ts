import userDao from "../user/dao";
import bcrypt from "bcrypt";
import { compare } from "bcrypt";
import { ILogin } from "./types";
import { HttpError } from "../../errors/HttpError";
import jwt from "jsonwebtoken";

const authService = {
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

    if (newPassword.length < 8)
      throw new HttpError(
        400,
        "La nueva contraseña debe tener al menos 8 caracteres",
      );

    const password = await bcrypt.hash(newPassword, 10);

    await userDao.changePassword(id, password);

    return { message: "Contraseña Actualizada" };
  },

  async findById(id: string) {
    const userExists = await userDao.findByid(id);
    if (!userExists) throw new HttpError(404, "Recurso no encotrado");
    return userExists;
  },
};

export default authService;
