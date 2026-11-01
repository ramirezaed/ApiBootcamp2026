import { IUpdateUserDao, IRegisterUserDao } from "./types";
import { Users } from "./model";
import { ClientSession } from "mongoose";
const userDao = {
  index: (skip: number, limit: number) =>
    Users.find({ deletedAt: null }).skip(skip).limit(limit),
  count: () => Users.countDocuments({ deletedAt: null }),

  findbyEmail: (email: string) => Users.findOne({ email, deletedAt: null }),

  findByid: (id: string) => Users.findById({ _id: id, deletedAt: null }),

  register: (user: IRegisterUserDao) => Users.create(user),

  update: (id: string, user: Partial<IUpdateUserDao>) =>
    Users.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: user },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ),
  destroy: (id: string, session: ClientSession) =>
    Users.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { session },
    ),

  findByEmailWithPassword: (email: string) =>
    Users.findOne({ email, deletedAt: null }).select("+password"),

  findUserWithPassword: (id: string) =>
    Users.findOne({ _id: id, deletedAt: null }).select("+password"),

  changePassword: (id: string, newPassword: string) =>
    Users.findOneAndUpdate(
      {
        _id: id,
        deletedAt: null,
      },
      {
        password: newPassword,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).select("password"),
};

export default userDao;
