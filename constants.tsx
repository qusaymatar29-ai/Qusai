
import { StyleOption } from './types';

export const NETWORK_ATTACK_COLORS: Record<string, string> = {
  DDoS: 'text-red-500 bg-red-500/10 border-red-500/30',
  ARP_Spoofing: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
  DNS_Hijacking: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
  Port_Scan: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  Brute_Force: 'text-pink-500 bg-pink-500/10 border-pink-500/30'
};

export const DEVICE_TYPE_ICONS: Record<string, string> = {
  Mobile: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
  Workstation: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  IoT: 'M13 10V3L4 14h7v7l9-11h-7z',
  SmartTV: 'M7 4h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2zm0 14h10',
  Router: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0'
};

// Added INTERIOR_STYLES as requested by components/StyleCarousel.tsx to resolve import error
export const INTERIOR_STYLES: StyleOption[] = [
  {
    id: 'modern',
    name: 'Modern Minimalist',
    thumbnail: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=400',
    description: 'Clean lines, neutral palette, and functional furniture for a sleek look.'
  },
  {
    id: 'bohemian',
    name: 'Bohemian Rhapsody',
    thumbnail: 'https://images.unsplash.com/photo-1558882224-cca16673a6b1?auto=format&fit=crop&q=80&w=400',
    description: 'Eclectic patterns, natural textures, and a cozy, lived-in feel.'
  },
  {
    id: 'industrial',
    name: 'Urban Industrial',
    thumbnail: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=400',
    description: 'Exposed brick, metal accents, and a raw, architectural aesthetic.'
  },
  {
    id: 'scandinavian',
    name: 'Nordic Scandi',
    thumbnail: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=400',
    description: 'Bright spaces, light wood, and simple, elegant functionality.'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    thumbnail: 'https://images.unsplash.com/photo-1605806616949-1e87b487fc2f?auto=format&fit=crop&q=80&w=400',
    description: 'High-contrast lighting, neon accents, and futuristic high-tech vibes.'
  }
];
