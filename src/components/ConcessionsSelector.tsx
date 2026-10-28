import React, { useState } from 'react';
import { Movie, Showtime, Auditorium, SeatInfo, SnackItem, BookingSnack, Booking } from '../types';
import { SNACKS_MENU } from '../data/cinemaData';
import { X, Plus, Minus, ArrowLeft, CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConcessionsSelectorProps {
  payload: {
    movie: Movie;
    showtime: Showtime;
    auditorium: Auditorium;
    selectedSeats: SeatInfo[];
  };
  onBack: () => void;
  onBookingConfirmed: (booking: Booking) => void;
  onClose: () => void;
}

export const ConcessionsSelector: React.FC<ConcessionsSelectorProps> = ({
  payload,
  onBack,
  onBookingConfirmed,
  onClose,
}) => {
  const { movie, showtime, auditorium, selectedSeats } = payload;

  const [snackQuantities, setSnackQuantities] = useState<{ [snackId: string]: number }>({});
  const [customerName, setCustomerName] = useState<string>('Alex Mercer');
  const [customerEmail, setCustomerEmail] = useState<string>('alex.mercer@cinema-fan.com');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleUpdateQty = (snackId: string, delta: number) => {
    setSnackQuantities((prev) => {
      const current = prev[snackId] || 0;
      const updated = Math.max(0, current + delta);
      return { ...prev, [snackId]: updated };
    });
  };

  const selectedSnacks: BookingSnack[] = SNACKS_MENU.map((item) => ({
    snack: item,
    quantity: snackQuantities[item.id] || 0,
  })).filter((item) => item.quantity > 0);

  const seatsSubtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const snacksSubtotal = selectedSnacks.reduce(
    (acc, s) => acc + s.snack.price * s.quantity,
    0
  );
  const rawSubtotal = seatsSubtotal + snacksSubtotal;
  const tax = +(rawSubtotal * 0.08).toFixed(2);
  const bookingFee = 2.5;
  const total = +(rawSubtotal + tax + bookingFee).toFixed(2);

  const handleConfirmReservation = () => {
    if (!customerName.trim() || !customerEmail.trim()) {
      alert('Please provide your name and email for ticket issuance.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Fire celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#3b82f6', '#f59e0b', '#10b981'],
      });

      const uniqueBookingRef = `IMOV-${Math.floor(1000 + Math.random() * 9000)}-${Math.random()
        .toString(36)
        .substring(2, 4)
        .toUpperCase()}`;

      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        bookingRef: uniqueBookingRef,
        movieId: movie.id,
        movieTitle: movie.title,
        posterUrl: movie.posterUrl,
        auditoriumName: auditorium.name,
        format: auditorium.format,
        date: showtime.date,
        time: showtime.time,
        seats: selectedSeats.map((s) => s.id),
        seatDetails: selectedSeats.map((s) => ({
          seatId: s.id,
          tier: s.tier,
          price: s.price,
        })),
        snacks: selectedSnacks,
        subtotal: rawSubtotal,
        tax,
        bookingFee,
        totalAmount: total,
        bookedAt: new Date().toISOString(),
        status: 'confirmed',
        customerName,
        customerEmail,
      };

      setIsSubmitting(false);
      onBookingConfirmed(newBooking);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#0b0f17] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="text-xs text-cyan-400 font-semibold">Step 2 of 2</div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Concessions & Final Confirmation
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Concessions Menu */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">Add Cinema Treats & Combos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SNACKS_MENU.map((item) => {
                const qty = snackQuantities[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="text-2xl mb-2">{item.imageIcon}</div>
                      <div className="text-sm font-bold text-white leading-tight mb-1">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                        {item.description}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-cyan-400 font-bold font-mono text-sm tabular-nums">
                        ${item.price.toFixed(2)}
                      </span>

                      <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                        <button
                          onClick={() => handleUpdateQty(item.id, -1)}
                          disabled={qty === 0}
                          className="text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-mono font-bold w-4 text-center text-white tabular-nums">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.id, 1)}
                          className="text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Details & Order Summary split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            {/* Customer Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Ticket Holder Details</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. Alex Mercer"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Email (for digital QR pass)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. alex.mercer@cinema.com"
                  />
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Simulated Express.js & MongoDB backend will verify the seat mutex lock before
                    issuing cryptographic ticket reference.
                  </span>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">Reservation Summary</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>
                    {selectedSeats.length}x Tickets ({selectedSeats.map((s) => s.id).join(', ')})
                  </span>
                  <span className="font-mono tabular-nums text-white">
                    ${seatsSubtotal.toFixed(2)}
                  </span>
                </div>

                {selectedSnacks.map(({ snack, quantity }) => (
                  <div key={snack.id} className="flex justify-between text-slate-400">
                    <span>
                      {quantity}x {snack.name}
                    </span>
                    <span className="font-mono tabular-nums">
                      ${(snack.price * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between text-slate-400">
                  <span>Municipal Sales Tax (8%)</span>
                  <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Booking & Licensing Fee</span>
                  <span className="font-mono tabular-nums">${bookingFee.toFixed(2)}</span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                  <span>Total Due</span>
                  <span className="text-cyan-400 font-mono text-base tabular-nums">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Back to Seat Map
          </button>

          <button
            onClick={handleConfirmReservation}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-400/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Locking Seats & Generating Ticket...</span>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Confirm & Generate Digital Ticket (${total.toFixed(2)})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
