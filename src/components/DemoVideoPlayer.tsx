import React, { useState, useEffect, useRef } from 'react';
import { DEMO_VIDEO_CHAPTERS } from '../data/architectureData';
import { VideoChapter } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Sparkles,
  Layers,
  Film,
  Armchair,
  Clock,
  Ticket,
  Code2,
  ExternalLink,
} from 'lucide-react';

interface DemoVideoPlayerProps {
  onLaunchLiveBooking: () => void;
  onExploreArchitecture: () => void;
}

export const DemoVideoPlayer: React.FC<DemoVideoPlayerProps> = ({
  onLaunchLiveBooking,
  onExploreArchitecture,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const totalDuration = 215; // 3m 35s

  const playerRef = useRef<HTMLDivElement>(null);

  // Determine current chapter
  const currentChapter =
    DEMO_VIDEO_CHAPTERS.slice()
      .reverse()
      .find((ch) => currentTime >= ch.startTime) || DEMO_VIDEO_CHAPTERS[0];

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalDuration]);

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleFullscreen = () => {
    if (!playerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      playerRef.current.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <Film className="w-4 h-4" />
            <span>Interactive Demo & Architecture Walkthrough</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            The IMovies System Demo Video
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Watch the animated technical and user walkthrough demonstrating the client-server architecture,
            concurrency-safe seat locks, and contactless QR ticket issuance.
          </p>
        </div>

        <button
          onClick={onLaunchLiveBooking}
          className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-400/20 whitespace-nowrap shrink-0"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Launch Live Cinema App</span>
        </button>
      </div>

      {/* Main Video Presentation Player */}
      <div
        ref={playerRef}
        className="relative rounded-2xl bg-black border border-slate-800 overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Cinematic Display Screen (Aspect 16:9 approx) */}
        <div className="relative aspect-video w-full bg-gradient-to-br from-[#070a12] via-[#0b0f1a] to-[#04060a] overflow-hidden flex items-center justify-center select-none">
          {/* Ambient Cinema hall background glow */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img
              src="/src/assets/images/hero_cinema_experience_1793183884121.jpg"
              alt="Cinema Hall Backdrop"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover blur-sm"
            />
          </div>

          {/* Dynamic Scene Renderer based on current Chapter */}
          <div className="relative z-10 w-full h-full p-6 md:p-12 flex flex-col justify-between">
            {/* Top Bar inside Video */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-bold text-white uppercase tracking-wider">
                  The IMovies Master Reel
                </span>
                <span className="text-slate-500 font-mono">· 4K UHD 60fps</span>
              </div>

              <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-cyan-400">
                {currentChapter.title}
              </div>
            </div>

            {/* Middle Animated Scene Content */}
            <div className="my-auto max-w-3xl mx-auto w-full text-center space-y-4">
              {currentChapter.visualScene === 'intro' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Layers className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                    Full-Stack Client-Server Cinema Architecture
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                    React 19 SPA ➔ Express.js REST Gateway ➔ Concurrency Mutex Manager ➔ MongoDB 7 Replica Set
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {['Zero Double-Booking', 'Sub-100ms Locks', 'Mongoose ODM', 'JWT Bearer Auth'].map((badge) => (
                      <span key={badge} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 font-mono">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {currentChapter.visualScene === 'catalog' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <Film className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                    Theatrical Catalog & Sensory Formats
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                    Dual 4K Laser IMAX, Dolby Atmos 64-Channel 3D Audio, and Royal VIP Lounges with integrated trailers.
                  </p>
                  <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
                    <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
                      <div className="font-bold text-cyan-400">Odyssey Beyond</div>
                      <div className="text-[10px] text-slate-400">IMAX with Laser</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
                      <div className="font-bold text-amber-400">Shadow Protocol</div>
                      <div className="text-[10px] text-slate-400">Dolby Cinema</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
                      <div className="font-bold text-emerald-400">The Lost Citadel</div>
                      <div className="text-[10px] text-slate-400">VIP Lounge</div>
                    </div>
                  </div>
                </div>
              )}

              {currentChapter.visualScene === 'seat-matrix' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="inline-flex p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                    <Armchair className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                    Curved Amphitheater & Multi-Tier Pricing
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                    Acoustically calibrated geometry mapping rows A-B (Standard), C-F (Premium Center), and G-H (VIP Recliner).
                  </p>
                  {/* Miniature SVG Curve */}
                  <div className="w-48 h-6 mx-auto">
                    <svg viewBox="0 0 200 30" className="w-full h-full stroke-cyan-400 fill-none">
                      <path d="M 10 25 Q 100 5 190 25" strokeWidth="2.5" />
                    </svg>
                  </div>
                </div>
              )}

              {currentChapter.visualScene === 'locking' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 animate-pulse">
                    <Clock className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                    Atomic Mutex Lock & 300-Second Lease
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                    Simultaneous booking requests trigger optimistic locking with atomic <code className="text-cyan-400 font-mono">findOneAndUpdate</code>. Losing sessions receive 409 Conflict.
                  </p>
                  <div className="p-3 max-w-md mx-auto bg-slate-900 border border-rose-500/30 rounded-xl font-mono text-xs text-rose-300">
                    🔒 Seat [E7, E8] Mutex Acquired · TTL: 04:58 Remaining
                  </div>
                </div>
              )}

              {currentChapter.visualScene === 'ticket' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Ticket className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                    Contactless Scannable QR Boarding Pass
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                    Confirmed reservations generate cryptographic QR codes for rapid turnstile entry and digital receipt archival.
                  </p>
                  <div className="p-2.5 max-w-sm mx-auto bg-slate-900 border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-400">
                    ✓ PASS ISSUED: REF #IMOV-8842-AX
                  </div>
                </div>
              )}

              {currentChapter.visualScene === 'architecture' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                    <Code2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                    Comprehensive Engineering Suite
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                    Interactive ER Diagram, Mongoose schema viewer, Express controller code inspector, and Docker Compose orchestration.
                  </p>
                </div>
              )}
            </div>

            {/* Narrated Subtitle Strip inside Video */}
            <div className="bg-slate-950/85 backdrop-blur-md p-3 md:p-4 rounded-xl border border-slate-800 text-center max-w-2xl mx-auto">
              <div className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1">
                Voiceover Narration
              </div>
              <p className="text-xs md:text-sm text-white font-medium leading-relaxed">
                "{currentChapter.caption}"
              </p>
            </div>
          </div>
        </div>

        {/* Video Scrubber Timeline & Controls Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
          {/* Timeline Bar with Chapter Markers */}
          <div className="relative">
            <input
              type="range"
              min={0}
              max={totalDuration}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            {/* Chapter pins */}
            <div className="absolute top-0 left-0 right-0 flex justify-between pointer-events-none px-1">
              {DEMO_VIDEO_CHAPTERS.map((ch) => (
                <div
                  key={ch.id}
                  style={{ left: `${(ch.startTime / totalDuration) * 100}%` }}
                  className="w-1 h-2 bg-slate-600 rounded -mt-0.5"
                  title={ch.title}
                />
              ))}
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-lg bg-cyan-400 text-slate-950 flex items-center justify-center hover:bg-cyan-300 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
              </button>

              <button
                onClick={() => handleSeek(0)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="font-mono text-slate-400 text-xs tabular-nums">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Playback speed buttons */}
              <div className="flex items-center gap-1 bg-slate-900 px-1 py-0.5 rounded border border-slate-800">
                {[1, 1.25, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                      playbackSpeed === spd
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              <button
                onClick={handleToggleFullscreen}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                title="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Navigation List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Reel Chapters & Highlights
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEMO_VIDEO_CHAPTERS.map((ch, idx) => {
            const isActive = currentChapter.id === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  handleSeek(ch.startTime);
                  setIsPlaying(true);
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-mono text-cyan-400 font-bold">
                    0{idx + 1}. {formatTime(ch.startTime)}
                  </span>
                  <span className="text-slate-500 font-mono">{ch.duration}s</span>
                </div>
                <div className="text-xs font-bold text-white mb-1">{ch.title}</div>
                <div className="text-[11px] text-slate-400 line-clamp-2">{ch.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
