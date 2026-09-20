import { CollectedCard, PackHistoryItem, PersonCard, UserProfile } from '../types';
import { INITIAL_CARDS } from '../data/cards';

const STORAGE_KEYS = {
  COLLECTION: 'pcc_collection_v1',
  HISTORY: 'pcc_history_v1',
  CUSTOM_CARDS: 'pcc_custom_cards_v1',
  PROFILE: 'pcc_profile_v1',
};

export function getCustomCards(): PersonCard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_CARDS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomCard(card: PersonCard): void {
  try {
    const existing = getCustomCards();
    const updated = [card, ...existing.filter((c) => c.id !== card.id)];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_CARDS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save custom card', e);
  }
}

export function getAllAvailableCards(): PersonCard[] {
  const custom = getCustomCards();
  return [...INITIAL_CARDS, ...custom];
}

export function getStoredCollection(): Record<string, CollectedCard> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COLLECTION);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCollectionToStorage(collection: Record<string, CollectedCard>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(collection));
  } catch (e) {
    console.error('Failed to save collection', e);
  }
}

export function addCardsToCollection(cards: PersonCard[]): {
  updatedCollection: Record<string, CollectedCard>;
  newCardsCount: number;
} {
  const current = getStoredCollection();
  const now = new Date().toISOString();
  let newCardsCount = 0;

  cards.forEach((card) => {
    if (current[card.id]) {
      current[card.id].copies += 1;
      current[card.id].lastDiscoveredAt = now;
      current[card.id].card = card; // Update details in case card schema changed
    } else {
      newCardsCount += 1;
      current[card.id] = {
        cardId: card.id,
        card,
        copies: 1,
        firstDiscoveredAt: now,
        lastDiscoveredAt: now,
      };
    }
  });

  saveCollectionToStorage(current);
  return { updatedCollection: current, newCardsCount };
}

export function getStoredPackHistory(): PackHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordPackOpened(historyItem: PackHistoryItem): void {
  try {
    const history = getStoredPackHistory();
    const updated = [historyItem, ...history];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated.slice(0, 50))); // Keep last 50 packs
  } catch (e) {
    console.error('Failed to save pack history', e);
  }
}

export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch {}

  return {
    name: 'Player One',
    title: 'Novice Collector',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    packsOpened: 0,
    totalCardsCollected: 0,
    level: 1,
  };
}

export function updateStoredProfile(profile: Partial<UserProfile>): UserProfile {
  const current = getStoredProfile();
  const updated = { ...current, ...profile };
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
  } catch {}
  return updated;
}

export function resetEntireCollection(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.COLLECTION);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    const profile = getStoredProfile();
    updateStoredProfile({
      packsOpened: 0,
      totalCardsCollected: 0,
      level: 1,
    });
  } catch (e) {
    console.error('Failed to reset collection', e);
  }
}
