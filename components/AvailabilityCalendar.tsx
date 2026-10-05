"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface AvailabilityCalendarProps {
  hotelSlug: string;
}

interface DayAvailability {
  date: string;
  totalRooms: number;
  bookedRooms: number;
  available: boolean;
}

export default function AvailabilityCalendar({ hotelSlug }: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, [currentDate, hotelSlug]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const monthStr = `${year}-${month}`;
      
      const res = await fetch(`/api/hotels/${hotelSlug}/availability?month=${monthStr}`);
      const data = await res.json();
      if (data.success) {
        setAvailability(data.data);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2 md:p-4 border border-transparent"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dayData = availability.find((a) => a.date === dateStr);
    
    let statusClass = "bg-gray-100"; // default/past
    let dotClass = "bg-gray-400";
    
    const isPast = new Date(dateStr) < new Date(new Date().setHours(0,0,0,0));
    
    if (!isPast && dayData) {
      if (dayData.available) {
        statusClass = "bg-green-50 text-green-900 border-green-100 hover:bg-green-100";
        dotClass = "bg-green-500";
      } else {
        statusClass = "bg-red-50 text-red-900 border-red-100";
        dotClass = "bg-red-500";
      }
    }

    days.push(
      <div 
        key={d} 
        className={`p-2 md:p-4 border border-gray-100 flex flex-col items-center justify-center min-h-[60px] md:min-h-[80px] rounded-xl transition-colors ${statusClass}`}
      >
        <span className="font-semibold">{d}</span>
        {!isPast && dayData && (
          <div className="flex items-center gap-1 mt-1 text-[10px] md:text-xs text-gray-500">
            <span className={`w-2 h-2 rounded-full ${dotClass}`}></span>
            <span className="hidden md:inline">{dayData.available ? 'Available' : 'Booked'}</span>
          </div>
        )}
      </div>
    );
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
          <Loader2 className="animate-spin text-primary-600" size={32} />
        </div>
      )}
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 text-center text-xs font-bold text-gray-500 uppercase">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {days}
      </div>
      
      <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span> Available
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span> Fully Booked
        </div>
      </div>
    </div>
  );
}
