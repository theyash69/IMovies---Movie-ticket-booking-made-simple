import React, { useState } from 'react';
import { Terminal, Copy, Check, CheckCircle2, Server, Database, Container, BookOpen, Layers } from 'lucide-react';

export const FeaturesGuideView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const envExampleCode = `# Environment Configuration (.env)
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000

# MongoDB Connection String (Local or MongoDB Atlas)
MONGODB_URI=mongodb://localhost:27017/imovies_cinema

# JWT Security Secrets
JWT_SECRET=super_secure_cinema_jwt_secret_key_99482
JWT_EXPIRES_IN=24h

# Concurrency Engine TTL (Seconds)
SEAT_LOCK_TTL_SECONDS=300`;

  const dockerComposeCode = `version: '3.8'

services:
  app:
    build: .
    container_name: imovies-server
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/imovies_cinema
      - PORT=3000
    depends_on:
      - mongo

  mongo:
    image: mongo:7.0
    container_name: imovies-mongo
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  mongo-express:
    image: mongo-express:latest
    container_name: imovies-mongo-ui
    restart: always
    ports:
      - "8081:8081"
    environment:
      - ME_CONFIG_MONGODB_SERVER=mongo
    depends_on:
      - mongo

volumes:
  mongo-data:`;

  const seedScriptCode = `// scripts/seed.ts
import mongoose from 'mongoose';
import { Movie } from '../src/models/Movie';
import { Auditorium } from '../src/models/Auditorium';
import { Showtime } from '../src/models/Showtime';

async function seedCinema() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('⚡ Connected to MongoDB for Cinema Seeding...');

  await Movie.deleteMany({});
  await Auditorium.deleteMany({});
  await Showtime.deleteMany({});

  // Seed sample movies and auditoriums
  console.log(' Seeding Movies, Halls, and Initial Showtimes...');
  // ... (inserts sample records)
  console.log('✅ Cinema Database Seed Complete!');
  process.exit(0);
}

seedCinema();`;

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Documentation & Development Manual</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Setup Guide, Development & Features
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          Comprehensive operational manual providing prerequisites, local setup instructions, Docker orchestration,
          MongoDB seeding pipelines, and full REST API endpoint specifications.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">System Feature Matrix</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-cyan-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Real-Time Seat Mutex Lock</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Atomic 300-second reservation lease preventing duplicate seat allocations during high-volume checkout.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-amber-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Curved Amphitheater Seat Map</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Curved projection screen visualization with Standard, Premium Center, and VIP Recliner acoustic zones.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Contactless QR Ticket Passes</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Cryptographically signed QR boarding passes with printable admission layout and barcode references.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-purple-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Gourmet Concessions Ordering</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Artisanal popcorn combos, blue corn nachos, and cold-pressed sodas with itemized tax calculations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-blue-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Interactive Architecture Suite</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Built-in ER diagram, MVC code inspector, live HTTP pipeline trace, and simulated video walkthrough.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-rose-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Role-Based Access Control</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              JWT Bearer protection distinguishing standard moviegoers from theater operators and administrative staff.
            </p>
          </div>
        </div>
      </section>

      {/* Step-by-Step Local Setup Guide */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">Local Development & Setup Guide</h2>

        <div className="space-y-4 text-xs">
          {/* Step 1 */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-white text-sm">1. Clone & Install Dependencies</div>
              <span className="text-slate-500 font-mono">Node.js 18+ required</span>
            </div>
            <pre className="p-3 bg-slate-950 rounded-lg font-mono text-cyan-300 overflow-x-auto">
              <code>git clone https://github.com/imovies/cinema-platform.git
cd cinema-platform
npm install</code>
            </pre>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-white text-sm">2. Configure Environment Variables</div>
              <button
                onClick={() => handleCopy('env', envExampleCode)}
                className="px-2 py-1 bg-slate-800 text-slate-300 hover:text-white rounded text-[11px] flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'env' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'env' ? 'Copied' : 'Copy .env'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 overflow-x-auto">
              <code>{envExampleCode}</code>
            </pre>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-white text-sm">3. Seed Database & Start Development Server</div>
            </div>
            <pre className="p-3 bg-slate-950 rounded-lg font-mono text-emerald-400 overflow-x-auto">
              <code># Seed default movies, auditoriums, and showtimes
npm run seed

# Run frontend + backend server concurrently
npm run dev</code>
            </pre>
            <p className="text-slate-400 text-[11px]">
              The development server will launch on <code className="text-cyan-400">http://localhost:3000</code>.
            </p>
          </div>

          {/* Step 4: Docker Compose */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <Container className="w-4 h-4 text-cyan-400" />
                <span>Docker Container Orchestration</span>
              </div>
              <button
                onClick={() => handleCopy('docker', dockerComposeCode)}
                className="px-2 py-1 bg-slate-800 text-slate-300 hover:text-white rounded text-[11px] flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'docker' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'docker' ? 'Copied' : 'Copy YAML'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-lg font-mono text-slate-300 overflow-x-auto leading-relaxed">
              <code>{dockerComposeCode}</code>
            </pre>
            <div className="text-[11px] text-slate-400">
              Run <code className="text-cyan-400">docker compose up -d</code> to spin up the application along with MongoDB and the Mongo-Express GUI at <code className="text-cyan-400">http://localhost:8081</code>.
            </div>
          </div>
        </div>
      </section>

      {/* REST API Endpoints Specification */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">RESTful API Endpoints Reference</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Endpoint</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Auth Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr>
                <td className="py-2.5 px-4 font-bold text-emerald-400">GET</td>
                <td className="py-2.5 px-4 text-white">/api/v1/movies</td>
                <td className="py-2.5 px-4 font-sans text-slate-400">Retrieve all active theatrical movies</td>
                <td className="py-2.5 px-4 font-sans text-slate-500">Public</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-emerald-400">GET</td>
                <td className="py-2.5 px-4 text-white">/api/v1/showtimes/:id</td>
                <td className="py-2.5 px-4 font-sans text-slate-400">Get showtime layout & real-time seat lock state</td>
                <td className="py-2.5 px-4 font-sans text-slate-500">Public</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-amber-400">POST</td>
                <td className="py-2.5 px-4 text-white">/api/v1/showtimes/:id/lock-seats</td>
                <td className="py-2.5 px-4 font-sans text-slate-400">Atomically lock requested seats with 300s TTL</td>
                <td className="py-2.5 px-4 font-sans text-slate-500">Session Guard</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-cyan-400">POST</td>
                <td className="py-2.5 px-4 text-white">/api/v1/bookings</td>
                <td className="py-2.5 px-4 font-sans text-slate-400">Commit reservation, generate QR pass, write invoice</td>
                <td className="py-2.5 px-4 font-sans text-emerald-400">Bearer JWT</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-emerald-400">GET</td>
                <td className="py-2.5 px-4 text-white">/api/v1/bookings/my-reservations</td>
                <td className="py-2.5 px-4 font-sans text-slate-400">List confirmed ticket passes for logged-in user</td>
                <td className="py-2.5 px-4 font-sans text-emerald-400">Bearer JWT</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-rose-400">DELETE</td>
                <td className="py-2.5 px-4 text-white">/api/v1/bookings/:id</td>
                <td className="py-2.5 px-4 font-sans text-slate-400">Cancel ticket reservation and release seat in MongoDB</td>
                <td className="py-2.5 px-4 font-sans text-emerald-400">Bearer JWT</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
