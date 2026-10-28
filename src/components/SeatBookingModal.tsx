import React, { useState, useEffect } from 'react';
import { Movie, Showtime, Auditorium, SeatInfo, SeatTier } from '../types';
import { AUDITORIUMS_DATA, SHOWTIMES_DATA } from '../data/cinemaData';
import { X, Clock, ShieldAlert, Check, Armchair, ChevronRight, AlertCircle, Info } from 'lucide-react';

interface SeatBookingModalProps {
  movie: Movie;
  onClose: () => void;
  onProceedToCheckout: (payload: {
    movie: Movie;
    showtime: Showtime;
    auditorium: Auditorium;
    selectedSeats: SeatInfo[];
  }) => void;
}

export const SeatBookingModal: React.FC<SeatBookingModalProps> = ({
  movie,
  onClose,
  onProceedToCheckout,
}) => {
  // Available showtimes for this movie
  const availableShowtimes = SHOWTIMES_DATA.filter((st) => st.movieId === movie.id);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string>(
    availableShowtimes[0]?.id || SHOWTIMES_DATA[0].id
  );

  const currentShowtime =
    SHOWTIMES_DATA.find((st) => st.id === selectedShowtimeId) || SHOWTIMES_DATA[0];

  const currentAuditorium =
    AUDITORIUMS_DATA.find((aud) => aud.id === currentShowtime.auditoriumId) || AUDITORIUMS_DATA[0];

  // Selected seat IDs
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [lockTimeRemaining, setLockTimeRemaining] = useState<number>(300); // 5 mins in seconds

  // Real-time lock timer when seats are selected
  useEffect(() => {
    if (selectedSeatIds.length === 0) {
      setLockTimeRemaining(300);
      return;
    }

    const timer = setInterval(() => {
      setLockTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSelectedSeatIds([]); // release expired lock
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSeatIds.length]);

  // Construct seat grid for current auditorium
  const rows = currentAuditorium.rows;
  const cols = currentAuditorium.seatsPerRow;

  const getSeatTier = (row: string): SeatTier => {
    if (['A', 'B'].includes(row)) return 'standard';
    if (['C', 'D', 'E', 'F'].includes(row)) return 'premium';
    return 'vip';
  };

  const getSeatPrice = (tier: SeatTier): number => {
    switch (tier) {
      case 'standard':
        return currentShowtime.standardPrice;
      case 'premium':
        return currentShowtime.premiumPrice;
      case 'vip':
        return currentShowtime.vipPrice;
    }
  };

  const allSeats: SeatInfo[] = [];
  rows.forEach((row) => {
    for (let c = 1; c <= cols; c++) {
      const seatId = `${row}${c}`;
      const tier = getSeatTier(row);
      const isOccupied = currentShowtime.occupiedSeats.includes(seatId);
      const isLocked =
        Boolean(currentShowtime.lockedSeats[seatId]) &&
        currentShowtime.lockedSeats[seatId] > Date.now();
      const isSelected = selectedSeatIds.includes(seatId);
      const isAccessible = (row === 'A' && (c === 1 || c === cols));

      let state: SeatInfo['state'] = 'available';
      if (isSelected) state = 'selected';
      else if (isOccupied) state = 'reserved';
      else if (isLocked) state = 'locked';
      else if (isAccessible) state = 'accessible';

      allSeats.push({
        id: seatId,
        row,
        number: c,
        tier,
        price: getSeatPrice(tier),
        state,
        isAccessible,
      });
    }
  });

  const handleSeatClick = (seat: SeatInfo) => {
    if (seat.state === 'reserved' || seat.state === 'locked') return;

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= 8) {
        alert('Maximum 8 seats per booking session allowed.');
        return;
      }
      setSelectedSeatIds((prev) => [...prev, seat.id]);
    }
  };

  const selectedSeatObjects = allSeats.filter((s) => selectedSeatIds.includes(s.id));
  const subtotal = selectedSeatObjects.reduce((acc, s) => acc + s.price, 0);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#0b0f17] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 sm:px-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold">
              <span>{movie.title}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">{currentAuditorium.format}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Select Showtime & Auditorium Seats
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Showtime Selector strip */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Available Screening Sessions (Today, Oct 28)
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {availableShowtimes.map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    setSelectedShowtimeId(st.id);
                    setSelectedSeatIds([]); // reset selection when changing hall
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-left transition-all shrink-0 cursor-pointer ${
                    selectedShowtimeId === st.id
                      ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{st.time}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[140px] mt-0.5">
                    {st.auditoriumName}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Seat Map Section with Screen Projection */}
          <div className="p-6 bg-slate-950/70 rounded-2xl border border-slate-800/80 space-y-6">
            {/* Curved Screen Visualization */}
            <div className="relative flex flex-col items-center">
              <div className="w-4/5 max-w-xl h-8 relative">
                {/* SVG curved path */}
                <svg
                  viewBox="0 0 500 40"
                  className="w-full h-full stroke-cyan-400/80 fill-none filter drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                >
                  <path
                    d="M 20 35 Q 250 5 480 35"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase -mt-2">
                Auditorium Curved Screen
              </span>
            </div>

            {/* Seat Grid */}
            <div className="overflow-x-auto py-2">
              <div className="min-w-[500px] flex flex-col items-center gap-2.5">
                {rows.map((row) => {
                  const rowSeats = allSeats.filter((s) => s.row === row);
                  const tier = getSeatTier(row);

                  return (
                    <div key={row} className="flex items-center gap-2">
                      <span className="w-6 text-center text-xs font-bold text-slate-500">
                        {row}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {rowSeats.map((seat, index) => {
                          const isCenterGap = index === 4; // Aisle after seat 5

                          let seatClasses =
                            'w-7 h-7 sm:w-8 sm:h-8 rounded-t-lg rounded-b-sm flex items-center justify-center text-[10px] font-bold transition-all';

                          if (seat.state === 'selected') {
                            seatClasses +=
                              ' bg-cyan-400 text-slate-950 border border-cyan-300 shadow-md shadow-cyan-400/30 scale-105 cursor-pointer';
                          } else if (seat.state === 'reserved') {
                            seatClasses +=
                              ' bg-slate-800/70 text-slate-600 border border-slate-800 cursor-not-allowed';
                          } else if (seat.state === 'locked') {
                            seatClasses +=
                              ' bg-amber-500/20 text-amber-400 border border-amber-500/40 cursor-not-allowed';
                          } else if (tier === 'vip') {
                            seatClasses +=
                              ' bg-purple-950/40 text-purple-300 border border-purple-700/50 hover:bg-purple-800/60 hover:text-white cursor-pointer';
                          } else if (tier === 'premium') {
                            seatClasses +=
                              ' bg-blue-950/40 text-blue-300 border border-blue-700/50 hover:bg-blue-800/60 hover:text-white cursor-pointer';
                          } else {
                            seatClasses +=
                              ' bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-white cursor-pointer';
                          }

                          return (
                            <React.Fragment key={seat.id}>
                              <button
                                onClick={() => handleSeatClick(seat)}
                                disabled={seat.state === 'reserved' || seat.state === 'locked'}
                                className={seatClasses}
                                title={`${seat.id} (${tier.toUpperCase()}) - $${seat.price.toFixed(
                                  2
                                )}`}
                              >
                                {seat.state === 'selected' ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : seat.state === 'locked' ? (
                                  <ShieldAlert className="w-3 h-3 text-amber-400" />
                                ) : (
                                  seat.number
                                )}
                              </button>
                              {isCenterGap && <div className="w-4 sm:w-6" />}
                            </React.Fragment>
                          );
                        })}
                      </div>

                      <span className="w-6 text-center text-xs font-bold text-slate-500">
                        {row}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-slate-900 border border-slate-700" />
                <span>Standard (${currentShowtime.standardPrice.toFixed(2)})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-blue-950/40 border border-blue-700/50" />
                <span>Premium (${currentShowtime.premiumPrice.toFixed(2)})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-purple-950/40 border border-purple-700/50" />
                <span>VIP Recliner (${currentShowtime.vipPrice.toFixed(2)})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-cyan-400 border border-cyan-300" />
                <span className="text-white font-medium">Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <ShieldAlert className="w-2.5 h-2.5 text-amber-400" />
                </div>
                <span>Held / Locked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-slate-800/70 border border-slate-800" />
                <span>Occupied</span>
              </div>
            </div>
          </div>

          {/* Real-time Mutex Lock Notice & Timer */}
          {selectedSeatIds.length > 0 && (
            <div className="p-4 bg-cyan-950/30 border border-cyan-800/50 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Atomic Seat Lock Active</span>
                    <span className="text-cyan-400 font-mono text-sm tabular-nums">
                      {formatTimer(lockTimeRemaining)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Seats {selectedSeatIds.join(', ')} are currently locked exclusively for this
                    session. Complete checkout before timer expires.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 sm:px-6 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs">
            <div>
              <div className="text-slate-400">Selected Seats:</div>
              <div className="text-white font-bold">
                {selectedSeatIds.length > 0 ? selectedSeatIds.join(', ') : 'None selected'}
              </div>
            </div>
            {selectedSeatIds.length > 0 && (
              <div className="pl-4 border-l border-slate-800">
                <div className="text-slate-400">Subtotal:</div>
                <div className="text-cyan-400 font-bold font-mono text-base tabular-nums">
                  ${subtotal.toFixed(2)}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (selectedSeatIds.length === 0) return;
                onProceedToCheckout({
                  movie,
                  showtime: currentShowtime,
                  auditorium: currentAuditorium,
                  selectedSeats: selectedSeatObjects,
                });
              }}
              disabled={selectedSeatIds.length === 0}
              className={`flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                selectedSeatIds.length > 0
                  ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md shadow-cyan-400/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Continue to Concessions</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
