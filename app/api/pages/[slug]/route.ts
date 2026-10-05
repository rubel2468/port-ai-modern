import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";

// Public API to fetch published pages
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const page = await Page.findOne({
      slug,
      isPublished: true,
    }).lean();

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: page });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 });
  }
}
