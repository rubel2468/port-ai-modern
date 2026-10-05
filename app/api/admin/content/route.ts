import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";

// GET /api/admin/content - List all content pages
// GET /api/admin/content?slug=xxx - Get single page
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const page = await Page.findOne({ slug }).lean();
      if (!page) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: page });
    }

    const pages = await Page.find()
      .sort({ createdAt: -1 })
      .select("slug title isPublished createdAt updatedAt")
      .lean();

    return NextResponse.json({ success: true, data: pages });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

// POST /api/admin/content - Create new page
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { slug, title, metaTitle, metaDescription, content, isPublished } = body;

    if (!slug || !title || !content) {
      return NextResponse.json({ error: "Slug, title, and content are required" }, { status: 400 });
    }

    const existing = await Page.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "A page with this slug already exists" }, { status: 400 });
    }

    const page = await Page.create({
      slug: slug.toLowerCase().replace(/\s+/g, "-"),
      title,
      metaTitle: metaTitle || title,
      metaDescription,
      content,
      isPublished: isPublished || false,
    });

    return NextResponse.json({ success: true, data: page }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}

// PUT /api/admin/content - Update page
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { pageId, ...updateData } = body;

    if (!pageId) {
      return NextResponse.json({ error: "Page ID is required" }, { status: 400 });
    }

    const page = await Page.findByIdAndUpdate(pageId, updateData, { new: true });
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: page });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
  }
}

// DELETE /api/admin/content - Delete page
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { pageId } = body;

    if (!pageId) {
      return NextResponse.json({ error: "Page ID is required" }, { status: 400 });
    }

    await Page.findByIdAndDelete(pageId);
    return NextResponse.json({ success: true, message: "Page deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
  }
}
