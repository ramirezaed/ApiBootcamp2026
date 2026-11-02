import { Types } from "mongoose";

export interface IRegisterMovementDao {
  type: "deposit" | "transfer";
  account: Types.ObjectId;
  amount: number;
  transferId?: Types.ObjectId | null;
  counterpartAccount?: Types.ObjectId | null;
  balanceBefore: number;
  balanceAfter: number;
}
