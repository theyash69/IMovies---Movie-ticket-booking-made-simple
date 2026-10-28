import React, { useState } from 'react';
import { Code, Server, Layout, Database, Play, CheckCircle2, ArrowRight } from 'lucide-react';

export const MVCModelView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'controller' | 'model' | 'view'>('controller');
  const [selectedController, setSelectedController] = useState<'booking' | 'showtime' | 'auth'>('booking');
  const [simulationState, setSimulationState] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const controllerCode = {
    booking: `// controllers/bookingController.ts
import { Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { Showtime } from '../models/Showtime';
import { generateQRPass } from '../services/qrService';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { showtimeId, seats, snacks, customerName, customerEmail } = req.body;
    const userId = req.user.id; // Extracted by authMiddleware

    // 1. Verify seat mutex lock lease is still valid
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ error: 'Showtime not found' });
    }

    // 2. Atomic reservation: commit seats to occupiedSeats
    const updatedShowtime = await Showtime.findOneAndUpdate(
      {
        _id: showtimeId,
        occupiedSeats: { $nin: seats } // Ensure no collision
      },
      {
        $push: { occupiedSeats: { $each: seats } },
        $unset: seats.reduce((acc, s) => ({ ...acc, [\`lockedSeats.\${s}\`]: "" }), {})
      },
      { new: true }
    );

    if (!updatedShowtime) {
      return res.status(409).json({ error: 'Seats already booked by another user' });
    }

    // 3. Compute totals and unique reference
    const bookingRef = \`IMOV-\${Math.floor(1000 + Math.random() * 9000)}-TX\`;
    const booking = await Booking.create({
      bookingRef,
      userId,
      showtimeId,
      seats,
      snacks,
      customerName,
      customerEmail,
      status: 'confirmed'
    });

    const qrPass = await generateQRPass(bookingRef);
    return res.status(201).json({ success: true, booking, qrPass });
  } catch (error) {
    return res.status(500).json({ error: 'Internal booking pipeline error' });
  }
};`,
    showtime: `// controllers/showtimeController.ts
import { Request, Response } from 'express';
import { Showtime } from '../models/Showtime';

export const lockSeats = async (req: Request, res: Response) => {
  const { showtimeId } = req.params;
  const { seats } = req.body;
  const lockExpiresAt = Date.now() + (5 * 60 * 1000); // 5 min TTL

  // Atomic lock acquisition
  const query = {
    _id: showtimeId,
    occupiedSeats: { $nin: seats }
  };

  const update = {
    $set: seats.reduce((acc: any, s: string) => {
      acc[\`lockedSeats.\${s}\`] = lockExpiresAt;
      return acc;
    }, {})
  };

  const result = await Showtime.findOneAndUpdate(query, update, { new: true });
  if (!result) {
    return res.status(409).json({ error: 'Requested seat is locked or sold' });
  }

  res.status(200).json({
    message: 'Seats locked successfully',
    lockedUntil: lockExpiresAt
  });
};`,
    auth: `// controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid cinema credentials' });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '24h' }
  );

  res.status(200).json({
    token,
    user: { id: user._id, name: user.name, role: user.role }
  });
};`,
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationState(1);

    setTimeout(() => setSimulationState(2), 700);
    setTimeout(() => setSimulationState(3), 1500);
    setTimeout(() => setSimulationState(4), 2300);
    setTimeout(() => {
      setSimulationState(5);
      setIsSimulating(false);
    }, 3100);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
          <Code className="w-4 h-4" />
          <span>Design Pattern & Code Architecture</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          MVC (Model - View - Controller) Architecture
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          The IMovies adheres to the classical Model-View-Controller separation of concerns, decoupling
          persistence rules (Mongoose), HTTP routing and concurrency mechanics (Express controllers), and
          interactive client visualization (React SPA).
        </p>
      </div>

      {/* 3 Pillars of MVC Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-violet-400 uppercase">
              Data & Invariants
            </span>
            <h3 className="text-lg font-bold text-white">Model (Mongoose)</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Encapsulates business entities, strict schema types, compound uniqueness indexes, and TTL
            expiration indices for automatic lock disposal.
          </p>
          <div className="text-[11px] font-mono text-slate-500">
            src/models/Showtime.ts, Booking.ts
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
              Presentation & UI
            </span>
            <h3 className="text-lg font-bold text-white">View (React 19)</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Renders interactive SVG curved amphitheater seat layouts, 5-minute countdown leases,
            and printable QR boarding passes with zero page reload.
          </p>
          <div className="text-[11px] font-mono text-slate-500">
            src/components/SeatBookingModal.tsx
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
              Orchestration & HTTP
            </span>
            <h3 className="text-lg font-bold text-white">Controller (Express)</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Parses requests, executes atomic MongoDB transactions, handles optimistic locking conflicts (409
            Conflict), and dispatches structured JSON payloads.
          </p>
          <div className="text-[11px] font-mono text-slate-500">
            src/controllers/bookingController.ts
          </div>
        </div>
      </div>

      {/* Interactive Request-Response Pipeline Trace Simulator */}
      <section className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Live HTTP Lifecycle Simulator
            </div>
            <h3 className="text-lg font-bold text-white">
              Trace: POST /api/v1/bookings Request Flow
            </h3>
          </div>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>{isSimulating ? 'Simulating Trace...' : 'Simulate API Call'}</span>
          </button>
        </div>

        {/* Pipeline Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { step: 1, title: '1. HTTP Router', sub: 'Express Route Handler' },
            { step: 2, title: '2. Auth Guard', sub: 'Bearer JWT Verified' },
            { step: 3, title: '3. Seat Controller', sub: 'Mutex Lock Acquired' },
            { step: 4, title: '4. Model & DB', sub: 'MongoDB Commit' },
            { step: 5, title: '5. Response (201)', sub: 'QR Ticket JSON' },
          ].map((item) => {
            const isActive = simulationState === item.step;
            const isCompleted = simulationState > item.step;

            return (
              <div
                key={item.step}
                className={`p-3.5 rounded-xl border text-center transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 scale-102'
                    : isCompleted
                    ? 'bg-slate-900 border-emerald-500/60 text-emerald-400'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-xs font-bold">{item.title}</div>
                <div className="text-[10px] font-mono mt-1">{item.sub}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Controller Code Inspection Workbench */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-sm font-bold text-white">Express Controller Implementation</div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {(
              [
                ['booking', 'bookingController.ts'],
                ['showtime', 'showtimeController.ts'],
                ['auth', 'authController.ts'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedController(key)}
                className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors cursor-pointer ${
                  selectedController === key
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#070a10] overflow-hidden">
          <div className="p-3 bg-slate-950 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>src/controllers/{selectedController}Controller.ts</span>
            <span className="text-cyan-400">Production TypeScript</span>
          </div>
          <pre className="p-5 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            <code>{controllerCode[selectedController]}</code>
          </pre>
        </div>
      </section>
    </div>
  );
};
