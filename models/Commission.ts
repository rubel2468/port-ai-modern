import mongoose, { Schema, Document, models } from "mongoose";

export interface ICommission extends Document {
  vendor: mongoose.Types.ObjectId;
  rate: number; // percentage e.g. 10 = 10%
  type: "percentage" | "flat";
  flatAmount?: number;
  notes?: string;
  setBy: mongoose.Types.ObjectId; // admin user
  createdAt: Date;
}

const CommissionSchema = new Schema<ICommission>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    rate: { type: Number, required: true, default: 10, min: 0, max: 100 },
    type: { type: String, enum: ["percentage", "flat"], default: "percentage" },
    flatAmount: Number,
    notes: String,
    setBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Commission = models.Commission || mongoose.model<ICommission>("Commission", CommissionSchema);
export default Commission;
