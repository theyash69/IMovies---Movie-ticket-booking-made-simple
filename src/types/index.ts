export type Genre = 'Sci-Fi' | 'Action' | 'Fantasy' | 'Thriller' | 'Drama' | 'IMAX 3D';

export type ScreenFormat = 'IMAX with Laser' | 'Dolby Cinema' | '4DX Dynamic' | 'VIP Lounge';

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  genre: Genre[];
  durationMinutes: number;
  certification: string;
  imdbRating: number;
  rottenTomatoesScore: number;
  posterUrl: string;
  backdropUrl: string;
  synopsis: string;
  director: string;
  cast: string[];
  releaseDate: string;
  availableFormats: ScreenFormat[];
  featured?: boolean;
}

export interface Auditorium {
  id: string;
  name: string;
  format: ScreenFormat;
  soundSystem: string;
  projection: string;
  totalSeats: number;
  rows: string[];
  seatsPerRow: number;
}

export interface Showtime {
  id: string;
  movieId: string;
  auditoriumId: string;
  auditoriumName: string;
  format: ScreenFormat;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "14:30"
  standardPrice: number;
  premiumPrice: number;
  vipPrice: number;
  occupiedSeats: string[]; // e.g. ["C4", "C5", "F7"]
  lockedSeats: { [seatId: string]: number }; // seatId -> expiry timestamp ms
}

export type SeatTier = 'standard' | 'premium' | 'vip';
export type SeatState = 'available' | 'selected' | 'reserved' | 'locked' | 'accessible';

export interface SeatInfo {
  id: string; // e.g. "E7"
  row: string;
  number: number;
  tier: SeatTier;
  price: number;
  state: SeatState;
  isAccessible?: boolean;
}

export interface SnackItem {
  id: string;
  name: string;
  category: 'Popcorn' | 'Combos' | 'Beverages' | 'Gourmet';
  price: number;
  calories: string;
  description: string;
  imageIcon: string;
}

export interface BookingSnack {
  snack: SnackItem;
  quantity: number;
}

export interface Booking {
  id: string;
  bookingRef: string; // e.g. "IMOV-9281-NX"
  movieId: string;
  movieTitle: string;
  posterUrl: string;
  auditoriumName: string;
  format: ScreenFormat;
  date: string;
  time: string;
  seats: string[];
  seatDetails: { seatId: string; tier: SeatTier; price: number }[];
  snacks: BookingSnack[];
  subtotal: number;
  tax: number;
  bookingFee: number;
  totalAmount: number;
  bookedAt: string;
  status: 'confirmed' | 'cancelled';
  customerName: string;
  customerEmail: string;
}

export type AppNavTab =
  | 'cinema'
  | 'architecture'
  | 'er-diagram'
  | 'mvc-model'
  | 'system-flow'
  | 'features-setup'
  | 'demo-video';

// Architecture types
export interface ArchitectureLayer {
  id: string;
  name: string;
  color: string;
  description: string;
  nodes: {
    id: string;
    name: string;
    tech: string;
    description: string;
    responsibilities: string[];
    metrics?: string;
  }[];
}

// ER Diagram types
export interface ERField {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  foreignTable?: string;
  required?: boolean;
  description: string;
}

export interface EREntity {
  id: string;
  name: string;
  collection: string;
  description: string;
  fields: ERField[];
  relationships: {
    target: string;
    cardinality: '1:1' | '1:N' | 'N:1' | 'N:M';
    description: string;
  }[];
  mongooseSchemaCode: string;
}

// System Flow types
export interface FlowStep {
  step: number;
  from: string;
  to: string;
  action: string;
  description: string;
  status: string;
}

export interface SystemSequence {
  id: string;
  title: string;
  description: string;
  steps: FlowStep[];
}

// Demo Video Chapter types
export interface VideoChapter {
  id: string;
  title: string;
  startTime: number; // in seconds
  duration: number; // in seconds
  caption: string;
  subtitle: string;
  keyFeatures: string[];
  visualScene: 'intro' | 'catalog' | 'seat-matrix' | 'locking' | 'ticket' | 'architecture';
}
