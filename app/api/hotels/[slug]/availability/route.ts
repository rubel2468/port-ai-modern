import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Hotel from "@/models/Hotel";
import Room from "@/models/Room";
import Booking from "@/models/Booking";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const url = new URL(req.url);
    const month = url.searchParams.get("month"); // YYYY-MM
    
    if (!month) {
      return NextResponse.json({ success: false, error: "Month parameter is required (YYYY-MM)" }, { status: 400 });
    }

    const hotel = await Hotel.findOne({ slug });
    if (!hotel) {
      return NextResponse.json({ success: false, error: "Hotel not found" }, { status: 404 });
    }

    const rooms = await Room.find({ hotel: hotel._id });
    const totalRoomsCount = rooms.reduce((acc, room) => acc + (room.quantity || 1), 0);
    const roomIds = rooms.map(room => room._id);

    // Get start and end of the month
    const [yearStr, monthStr] = month.split("-");
    const year = parseInt(yearStr);
    const monthNum = parseInt(monthStr) - 1; // 0-indexed
    
    const startDate = new Date(year, monthNum, 1);
    const endDate = new Date(year, monthNum + 1, 0); // Last day of month

    // Find overlapping bookings
    const bookings = await Booking.find({
      room: { $in: roomIds },
      status: { $ne: "cancelled" },
      $or: [
        { checkIn: { $lte: endDate }, checkOut: { $gte: startDate } }
      ]
    });

    const availability = [];
    const daysInMonth = endDate.getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const currentDate = new Date(year, monthNum, d);
      const dateString = `${year}-${String(monthNum + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      let bookedRoomsCount = 0;
      
      bookings.forEach(booking => {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        
        // Count if current date is within booking range (excluding checkout day)
        if (currentDate >= checkIn && currentDate < checkOut) {
          bookedRoomsCount += 1; 
        }
      });

      availability.push({
        date: dateString,
        totalRooms: totalRoomsCount,
        bookedRooms: bookedRoomsCount,
        available: totalRoomsCount > bookedRoomsCount
      });
    }

    return NextResponse.json({ success: true, data: availability });
    
  } catch (error: any) {
    console.error("Availability fetch error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
