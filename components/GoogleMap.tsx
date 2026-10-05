"use client";

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  hotelName: string;
}

export default function GoogleMap({ latitude, longitude, hotelName }: GoogleMapProps) {
  if (!latitude || !longitude) {
    return (
      <div className="w-full h-[300px] md:h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">
        Map location not provided
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://maps.google.com/maps?q=${latitude},${longitude}&output=embed`}
        title={`Map location for ${hotelName}`}
      ></iframe>
    </div>
  );
}
