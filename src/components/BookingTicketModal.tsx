import React from 'react';
import { Booking } from '../types';
import { X, Printer, CheckCircle, Ticket, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';

interface BookingTicketModalProps {
  booking: Booking;
  onClose: () => void;
  onViewAllBookings: () => void;
}

export const BookingTicketModal: React.FC<BookingTicketModalProps> = ({
  booking,
  onClose,
  onViewAllBookings,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>Reservation Confirmed & Mutex Released</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Pass Container */}
        <div className="p-6 overflow-y-auto max-h-[80vh] space-y-6">
          {/* Card Ticket Design */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 overflow-hidden shadow-xl">
            {/* Top Movie Banner area */}
            <div className="relative h-28 overflow-hidden bg-slate-950">
              <img
                src={booking.posterUrl}
                alt={booking.movieTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
              <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                    Admission Pass
                  </span>
                  <h3 className="text-xl font-extrabold text-white leading-tight">
                    {booking.movieTitle}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                  {booking.format}
                </span>
              </div>
            </div>

            {/* Ticket Details Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase font-semibold">Date</div>
                    <div className="text-white font-medium">{booking.date}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase font-semibold">Time</div>
                    <div className="text-white font-medium">{booking.time}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase font-semibold">Auditorium</div>
                    <div className="text-white font-medium">{booking.auditoriumName}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Ticket className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase font-semibold">Reserved Seats</div>
                    <div className="text-cyan-400 font-bold font-mono text-sm">
                      {booking.seats.join(', ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Snacks if any */}
              {booking.snacks.length > 0 && (
                <div className="pb-3 border-b border-slate-800 text-[11px]">
                  <div className="text-slate-500 uppercase font-semibold text-[10px] mb-1">
                    Concessions Pre-Order
                  </div>
                  <div className="text-slate-300">
                    {booking.snacks.map((s) => `${s.quantity}x ${s.snack.name}`).join(' · ')}
                  </div>
                </div>
              )}

              {/* QR Code and Reference Strip */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                    Booking Reference
                  </div>
                  <div className="text-white font-mono font-bold text-base tracking-wider">
                    {booking.bookingRef}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Holder: <span className="text-slate-200">{booking.customerName}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Total Paid: <span className="text-cyan-400 font-mono font-bold">${booking.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* SVG QR Code */}
                <div className="p-2 bg-white rounded-xl shadow-md flex flex-col items-center">
                  <svg className="w-20 h-20" viewBox="0 0 100 100" fill="currentColor">
                    {/* Stylized QR Code Matrix */}
                    <rect width="100" height="100" fill="white" />
                    <rect x="10" y="10" width="26" height="26" fill="black" />
                    <rect x="14" y="14" width="18" height="18" fill="white" />
                    <rect x="18" y="18" width="10" height="10" fill="black" />

                    <rect x="64" y="10" width="26" height="26" fill="black" />
                    <rect x="68" y="14" width="18" height="18" fill="white" />
                    <rect x="72" y="18" width="10" height="10" fill="black" />

                    <rect x="10" y="64" width="26" height="26" fill="black" />
                    <rect x="14" y="68" width="18" height="18" fill="white" />
                    <rect x="18" y="72" width="10" height="10" fill="black" />

                    {/* Data modules */}
                    <rect x="42" y="14" width="6" height="6" fill="black" />
                    <rect x="52" y="14" width="6" height="10" fill="black" />
                    <rect x="42" y="26" width="12" height="6" fill="black" />
                    <rect x="42" y="38" width="6" height="18" fill="black" />
                    <rect x="52" y="44" width="12" height="6" fill="black" />
                    <rect x="70" y="44" width="16" height="6" fill="black" />
                    <rect x="14" y="44" width="18" height="6" fill="black" />
                    <rect x="42" y="64" width="16" height="6" fill="black" />
                    <rect x="64" y="64" width="10" height="16" fill="black" />
                    <rect x="78" y="70" width="12" height="6" fill="black" />
                    <rect x="42" y="76" width="6" height="14" fill="black" />
                    <rect x="54" y="80" width="16" height="8" fill="black" />
                  </svg>
                  <span className="text-[9px] font-mono font-bold text-slate-900 mt-1">SCAN AT GATE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={onViewAllBookings}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Go to My Bookings
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-400/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
