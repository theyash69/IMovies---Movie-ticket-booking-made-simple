import React from 'react';
import { Booking } from '../types';
import { X, Ticket, Calendar, Clock, MapPin, Eye, Trash2, AlertCircle } from 'lucide-react';

interface UserBookingsModalProps {
  bookings: Booking[];
  onClose: () => void;
  onViewTicket: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
}

export const UserBookingsModal: React.FC<UserBookingsModalProps> = ({
  bookings,
  onClose,
  onViewTicket,
  onCancelBooking,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0b0f17] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              My Cinema Reservations ({bookings.length})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bookings List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {bookings.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <Ticket className="w-12 h-12 mx-auto stroke-1" />
              <div className="text-sm font-semibold text-slate-400">No Reservations Yet</div>
              <p className="text-xs max-w-xs mx-auto">
                Select a featured movie from the cinema catalog and reserve your preferred seats.
              </p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={booking.posterUrl}
                    alt={booking.movieTitle}
                    referrerPolicy="no-referrer"
                    className="w-14 h-20 object-cover rounded-lg border border-slate-800 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-cyan-400">
                        {booking.bookingRef}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          booking.status === 'confirmed'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                        }`}
                      >
                        {booking.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-1">{booking.movieTitle}</h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {booking.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {booking.auditoriumName}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 mt-1">
                      Seats: <span className="font-mono text-cyan-300 font-bold">{booking.seats.join(', ')}</span> · Paid: <span className="font-mono text-white">${booking.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <button
                    onClick={() => onViewTicket(booking)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Pass</span>
                  </button>

                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => onCancelBooking(booking.id)}
                      className="p-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Cancel Booking & Refund"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
