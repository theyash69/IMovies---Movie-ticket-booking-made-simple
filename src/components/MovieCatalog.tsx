import React, { useState } from 'react';
import { Movie, Genre } from '../types';
import { Clock, Star, Play, Film, Sparkles, ChevronRight, X, Volume2, ShieldCheck } from 'lucide-react';

interface MovieCatalogProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onExploreArchitecture: () => void;
}

export const MovieCatalog: React.FC<MovieCatalogProps> = ({
  movies,
  onSelectMovie,
  onExploreArchitecture,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [activeDetailMovie, setActiveDetailMovie] = useState<Movie | null>(null);
  const [trailerPlaying, setTrailerPlaying] = useState<boolean>(false);

  const featuredMovie = movies.find((m) => m.featured) || movies[0];

  const genres: string[] = ['All', 'Sci-Fi', 'Action', 'Fantasy', 'IMAX 3D'];

  const filteredMovies = movies.filter((movie) => {
    if (selectedGenre === 'All') return true;
    return movie.genre.includes(selectedGenre as Genre);
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Showcase Section */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="relative h-[440px] md:h-[500px] w-full overflow-hidden">
          <img
            src={featuredMovie.backdropUrl}
            alt={featuredMovie.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Measured gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f17] via-[#0b0f17]/80 to-transparent" />

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-3xl">
            {/* Unboxed metadata kicker */}
            <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-cyan-400 mb-2">
              <span>Premiering This Week</span>
              <span aria-hidden="true">·</span>
              <span>Auditorium 1: Grand IMAX Laser</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {featuredMovie.imdbRating} IMDb
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight text-balance mb-3 leading-tight">
              {featuredMovie.title}
            </h1>

            <p className="text-sm md:text-base text-slate-300 line-clamp-2 md:line-clamp-3 mb-6 max-w-2xl leading-relaxed">
              {featuredMovie.synopsis}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onSelectMovie(featuredMovie)}
                className="px-6 py-3 text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer"
              >
                <Film className="w-4 h-4" />
                <span>Select Showtime & Seats</span>
              </button>

              <button
                onClick={() => {
                  setActiveDetailMovie(featuredMovie);
                  setTrailerPlaying(true);
                }}
                className="px-5 py-3 text-sm font-medium text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors flex items-center gap-2 backdrop-blur-sm cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Watch Theatrical Preview</span>
              </button>

              <button
                onClick={onExploreArchitecture}
                className="hidden sm:flex px-4 py-3 text-xs font-semibold text-slate-400 hover:text-white transition-colors items-center gap-1.5"
              >
                <span>Inspect System Architecture</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4-Item Technology & Cinema Capabilities Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-slate-800/80 bg-slate-950/60 divide-y md:divide-y-0 md:divide-x divide-slate-800/80 text-xs">
          <div className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-200">Dual 4K Laser IMAX</div>
              <div className="text-slate-500">Uncompressed HDR clarity</div>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-200">Dolby Atmos Audio</div>
              <div className="text-slate-500">64-Channel spatial ceiling array</div>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-200">Real-Time Seat Locks</div>
              <div className="text-slate-500">Zero double-booking mutex</div>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-200">Instant QR Boarding</div>
              <div className="text-slate-500">Paperless contact-free entry</div>
            </div>
          </div>
        </div>
      </section>

      {/* Movie Catalog Header & Filter Tabs */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Now Showing</h2>
            <p className="text-sm text-slate-400 mt-1">
              Select any title to view auditoriums, live seat layouts, and real-time reservation holds.
            </p>
          </div>

          {/* Interactive filter tabs (functional buttons) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedGenre === genre
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="group flex flex-col bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/50"
            >
              {/* Poster container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Top formats unboxed badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="bg-slate-950/80 backdrop-blur-md text-cyan-400 border border-cyan-500/30 font-semibold px-2.5 py-1 rounded">
                    {movie.availableFormats[0]}
                  </span>
                  <span className="bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 font-semibold px-2 py-1 rounded flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {movie.imdbRating}
                  </span>
                </div>

                {/* Quick Trailer Play Button Hover Overlay */}
                <button
                  onClick={() => {
                    setActiveDetailMovie(movie);
                    setTrailerPlaying(true);
                  }}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg cursor-pointer"
                  title="Watch Preview"
                >
                  <Play className="w-5 h-5 fill-slate-950 translate-x-0.5" />
                </button>
              </div>

              {/* Movie Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {movie.title}
                  </h3>

                  {/* Clean unboxed metadata with separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 mb-2.5">
                    <span>{movie.certification}</span>
                    <span aria-hidden="true">·</span>
                    <span>{movie.durationMinutes} min</span>
                    <span aria-hidden="true">·</span>
                    <span>{movie.genre.join(', ')}</span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {movie.synopsis}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2.5">
                  <button
                    onClick={() => onSelectMovie(movie)}
                    className="flex-1 py-2.5 px-4 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Book Tickets</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveDetailMovie(movie);
                      setTrailerPlaying(false);
                    }}
                    className="py-2.5 px-3 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                    title="Movie Details"
                  >
                    Info
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Movie & Trailer Preview Modal */}
      {activeDetailMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-white">{activeDetailMovie.title}</span>
                <span aria-hidden="true">·</span>
                <span>Theatrical Overview</span>
              </div>
              <button
                onClick={() => {
                  setActiveDetailMovie(null);
                  setTrailerPlaying(false);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-6">
              {/* Trailer / Backdrop simulation */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800">
                {trailerPlaying ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 animate-pulse">
                      <Film className="w-8 h-8" />
                    </div>
                    <div className="text-base font-bold text-white mb-1">
                      Streaming Official {activeDetailMovie.title} Theatrical 4K Preview
                    </div>
                    <p className="text-xs text-slate-400 max-w-md mb-4">
                      Simulated Dolby Atmos 12-channel audio demo track loaded with calibrated cinema mastering.
                    </p>
                    <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-cyan-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={activeDetailMovie.backdropUrl}
                      alt={activeDetailMovie.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button
                        onClick={() => setTrailerPlaying(true)}
                        className="w-14 h-14 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
                      >
                        <Play className="w-6 h-6 fill-slate-950 translate-x-0.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{activeDetailMovie.title}</h3>
                    <p className="text-xs text-cyan-400 font-medium mt-0.5">{activeDetailMovie.tagline}</p>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activeDetailMovie.synopsis}
                  </p>

                  <div className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-slate-500">Director: </span>
                      <span className="text-slate-200">{activeDetailMovie.director}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Lead Cast: </span>
                      <span className="text-slate-200">{activeDetailMovie.cast.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Release Date: </span>
                      <span className="text-slate-200">{activeDetailMovie.releaseDate}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                  <div className="text-xs font-semibold text-slate-400">Experience Specs</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Certification:</span>
                      <span className="font-semibold text-white">{activeDetailMovie.certification}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Runtime:</span>
                      <span className="font-semibold text-white">{activeDetailMovie.durationMinutes} mins</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>IMDb Score:</span>
                      <span className="font-semibold text-amber-400">{activeDetailMovie.imdbRating} / 10</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Rotten Tomatoes:</span>
                      <span className="font-semibold text-rose-400">{activeDetailMovie.rottenTomatoesScore}% Certified</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        const m = activeDetailMovie;
                        setActiveDetailMovie(null);
                        onSelectMovie(m);
                      }}
                      className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer text-center block"
                    >
                      Proceed to Seat Selection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
