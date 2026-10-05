import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/mongodb";
import Hotel from "@/models/Hotel";
import Room from "@/models/Room";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = await getToken({ req });
    if (!token || token.role !== "vendor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const hotel = await Hotel.findOne({ _id: id, vendor: token.sub });

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    const rooms = await Room.find({ hotel: hotel._id });

    return NextResponse.json({ hotel, rooms });
  } catch (error) {
    console.error("GET hotel error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = await getToken({ req });
    if (!token || token.role !== "vendor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { rooms, ...hotelData } = body;

    await connectDB();

    const hotel = await Hotel.findOneAndUpdate(
      { _id: id, vendor: token.sub },
      { $set: hotelData },
      { new: true }
    );

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found or unauthorized" }, { status: 404 });
    }

    if (rooms && Array.isArray(rooms)) {
      const roomIdsToKeep: string[] = [];

      for (const room of rooms) {
        if (room._id) {
          // Update existing room
          const updatedRoom = await Room.findOneAndUpdate(
            { _id: room._id, hotel: hotel._id },
            { $set: room },
            { new: true }
          );
          if (updatedRoom) {
            roomIdsToKeep.push(updatedRoom._id.toString());
          }
        } else {
          // Create new room
          const newRoom = await Room.create({
            ...room,
            hotel: hotel._id,
          });
          roomIdsToKeep.push(newRoom._id.toString());
        }
      }

      // Remove deleted rooms
      await Room.deleteMany({
        hotel: hotel._id,
        _id: { $nin: roomIdsToKeep },
      });
    }

    return NextResponse.json({ success: true, hotel });
  } catch (error) {
    console.error("PUT hotel error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = await getToken({ req });
    if (!token || token.role !== "vendor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const hotel = await Hotel.findOneAndUpdate(
      { _id: id, vendor: token.sub },
      { $set: { isActive: false } },
      { new: true }
    );

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Hotel deactivated successfully" });
  } catch (error) {
    console.error("DELETE hotel error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
