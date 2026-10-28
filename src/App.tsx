import React, { useState, useEffect } from 'react';
import { AppNavTab, Movie, Showtime, Auditorium, SeatInfo, Booking } from './types';
import { MOVIES_DATA, INITIAL_BOOKINGS } from './data/cinemaData';
import { Header } from './components/Header';
import { MovieCatalog } from './components/MovieCatalog';
import { SeatBookingModal } from './components/SeatBookingModal';
import { ConcessionsSelector } from './components/ConcessionsSelector';
import { BookingTicketModal } from './components/BookingTicketModal';
import { UserBookingsModal } from './components/UserBookingsModal';
import { ArchitectureView } from './components/ArchitectureView';
import { ERDiagramView } from './components/ERDiagramView';
import { MVCModelView } from './components/MVCModelView';
import { SystemFlowsView } from './components/SystemFlowsView';
import { FeaturesGuideView } from './components/FeaturesGuideView';
import { DemoVideoPlayer } from './components/DemoVideoPlayer';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppNavTab>('cinema');
  const [movies] = useState<Movie[]>(MOVIES_DATA);

  // Persistent bookings state
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('imovies_bookings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return INITIAL_BOOKINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('imovies_bookings', JSON.stringify(bookings));
    } catch (e) {
      // ignore
    }
  }, [bookings]);

  // Modal workflows
  const [selectedMovieForBooking, setSelectedMovieForBooking] = useState<Movie | null>(null);
  const [checkoutPayload, setCheckoutPayload] = useState<{
    movie: Movie;
    showtime: Showtime;
    auditorium: Auditorium;
    selectedSeats: SeatInfo[];
  } | null>(null);

  const [activeTicketBooking, setActiveTicketBooking] = useState<Booking | null>(null);
  const [showMyBookings, setShowMyBookings] = useState<boolean>(false);

  // Booking handlers
  const handleBookingConfirmed = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setCheckoutPayload(null);
    setSelectedMovieForBooking(null);
    setActiveTicketBooking(newBooking);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 flex flex-col font-sans">
      {/* Strict Top Bar Contract Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookingCount={bookings.length}
        onOpenMyBookings={() => setShowMyBookings(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-8">
        {activeTab === 'cinema' && (
          <MovieCatalog
            movies={movies}
            onSelectMovie={(movie) => setSelectedMovieForBooking(movie)}
            onExploreArchitecture={() => setActiveTab('architecture')}
          />
        )}

        {activeTab === 'architecture' && <ArchitectureView />}

        {activeTab === 'er-diagram' && <ERDiagramView />}

        {activeTab === 'mvc-model' && <MVCModelView />}

        {activeTab === 'system-flow' && <SystemFlowsView />}

        {activeTab === 'features-setup' && <FeaturesGuideView />}

        {activeTab === 'demo-video' && (
          <DemoVideoPlayer
            onLaunchLiveBooking={() => {
              setActiveTab('cinema');
              setSelectedMovieForBooking(movies[0]);
            }}
            onExploreArchitecture={() => setActiveTab('architecture')}
          />
        )}
      </main>

      {/* Step 1: Seat Selection & Showtime Modal */}
      {selectedMovieForBooking && !checkoutPayload && (
        <SeatBookingModal
          movie={selectedMovieForBooking}
          onClose={() => setSelectedMovieForBooking(null)}
          onProceedToCheckout={(payload) => setCheckoutPayload(payload)}
        />
      )}

      {/* Step 2: Concessions & Final Order Confirmation */}
      {checkoutPayload && (
        <ConcessionsSelector
          payload={checkoutPayload}
          onBack={() => setCheckoutPayload(null)}
          onBookingConfirmed={handleBookingConfirmed}
          onClose={() => {
            setCheckoutPayload(null);
            setSelectedMovieForBooking(null);
          }}
        />
      )}

      {/* Step 3: Digital QR Admission Pass Modal */}
      {activeTicketBooking && (
        <BookingTicketModal
          booking={activeTicketBooking}
          onClose={() => setActiveTicketBooking(null)}
          onViewAllBookings={() => {
            setActiveTicketBooking(null);
            setShowMyBookings(true);
          }}
        />
      )}

      {/* My Bookings History Drawer */}
      {showMyBookings && (
        <UserBookingsModal
          bookings={bookings}
          onClose={() => setShowMyBookings(false)}
          onViewTicket={(b) => {
            setShowMyBookings(false);
            setActiveTicketBooking(b);
          }}
          onCancelBooking={handleCancelBooking}
        />
      )}

      {/* Editorial Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/90 py-8 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight">The IMovies</span>
            <span>·</span>
            <span>Express.js & MongoDB Architecture</span>
            <span>·</span>
            <span>© 2026 The IMovies Cinema Systems</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('architecture')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              System Specs
            </button>
            <button
              onClick={() => setActiveTab('er-diagram')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              ER Diagram
            </button>
            <button
              onClick={() => setActiveTab('features-setup')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Setup Guide
            </button>
            <button
              onClick={() => setActiveTab('demo-video')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Walkthrough Video
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
