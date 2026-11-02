import { Schema, model } from "mongoose";

const movementSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["deposit", "transfer"],
      required: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: "Accounts",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    transferId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    counterpartAccount: {
      type: Schema.Types.ObjectId,
      ref: "Accounts",
      default: null,
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export const Movements = model("Movements", movementSchema);
