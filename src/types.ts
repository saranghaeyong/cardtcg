export type Rarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'ULTRA_RARE' | 'LEGENDARY';

export interface CardStats {
  charisma: number;
  energy: number;
  style: number;
}

export interface PersonCard {
  id: string;
  name: string;
  age: number;
  photo: string;
  rarity: Rarity;
  category: string;
  description: string;
  cardNumber: string;
  background: string;
  accent: string;
  stats: CardStats;
  custom?: boolean;
}

export interface CollectedCard {
  cardId: string;
  card: PersonCard;
  copies: number;
  firstDiscoveredAt: string;
  lastDiscoveredAt: string;
}

export interface PackHistoryItem {
  id: string;
  packNumber: number;
  packName: string;
  openedAt: string;
  cards: PersonCard[];
  newCardsCount: number;
}

export interface UserProfile {
  name: string;
  title: string;
  avatar: string;
  packsOpened: number;
  totalCardsCollected: number;
  level: number;
}

export interface AppSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  masterVolume: number;
  musicVolume: number;
  reducedMotion: boolean;
}

export type ActiveTab = 'HOME' | 'COLLECTION' | 'PACKS' | 'PROFILE' | 'SETTINGS';

export interface RarityDetails {
  name: string;
  label: string;
  color: string;
  textColor: string;
  borderColor: string;
  glowColor: string;
  bgGradient: string;
  foilType: 'none' | 'subtle' | 'silver' | 'purple' | 'prism' | 'gold_celestial';
  audioFrequency: number;
}
