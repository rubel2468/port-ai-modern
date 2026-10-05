import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";

const PLANS = {
  free: {
    price: 0,
    features: { maxHotels: 2, commissionDiscount: 0, featuredSlots: 0, prioritySupport: false, analyticsAccess: false },
  },
  silver: {
    price: 999,
    features: { maxHotels: 5, commissionDiscount: 5, featuredSlots: 1, prioritySupport: false, analyticsAccess: true },
  },
  gold: {
    price: 2499,
    features: { maxHotels: 15, commissionDiscount: 10, featuredSlots: 3, prioritySupport: true, analyticsAccess: true },
  },
  platinum: {
    price: 4999,
    features: { maxHotels: 999, commissionDiscount: 20, featuredSlots: 10, prioritySupport: true, analyticsAccess: true },
  },
};

// GET /api/vendor/subscription - Get current subscription
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let subscription = await Subscription.findOne({ vendor: token.sub }).lean();

    if (!subscription) {
      // Create a free plan by default
      subscription = await Subscription.create({
        vendor: token.sub,
        plan: "free",
        features: PLANS.free.features,
        price: 0,
      });
      subscription = subscription.toObject();
    }

    return NextResponse.json({ success: true, data: subscription, plans: PLANS });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
  }
}

// POST /api/vendor/subscription - Upgrade/change plan
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { plan } = body;

    if (!PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const planConfig = PLANS[plan as keyof typeof PLANS];
    const startsAt = new Date();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const subscription = await Subscription.findOneAndUpdate(
      { vendor: token.sub },
      {
        plan,
        features: planConfig.features,
        price: planConfig.price,
        startsAt,
        expiresAt: plan === "free" ? undefined : expiresAt,
        isActive: true,
        $push: planConfig.price > 0 ? {
          paymentHistory: {
            amount: planConfig.price,
            date: new Date(),
            status: "paid",
          },
        } : undefined,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: subscription });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
  }
}
