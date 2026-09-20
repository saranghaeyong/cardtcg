import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ActiveTab,
  AppSettings,
  CollectedCard,
  PackHistoryItem,
  PersonCard,
  UserProfile,
} from './types';
import { Navbar } from './components/Navbar';
import { ParticleCanvas } from './components/ParticleCanvas';
import { PackOpening } from './components/PackOpening';
import { CardReveal } from './components/CardReveal';
import { PackComplete } from './components/PackComplete';
import { CardModal } from './components/CardModal';
import { AdminAddCardModal } from './components/AdminAddCardModal';

import { Home } from './pages/Home';
import { Collection } from './pages/Collection';
import { Packs } from './pages/Packs';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

import {
  addCardsToCollection,
  getAllAvailableCards,
  getStoredCollection,
  getStoredPackHistory,
  getStoredProfile,
  recordPackOpened,
  resetEntireCollection,
  updateStoredProfile,
} from './utils/storage';
import { generatePack, PackType } from './utils/packGenerator';
import { soundManager } from './utils/audio';

export default function App() {
  // Navigation & Game Mode State
  const [activeTab, setActiveTab] = useState<ActiveTab>('HOME');
  const [gameMode, setGameMode] = useState<'IDLE' | 'OPENING_ANIMATION' | 'CARD_REVEAL' | 'PACK_COMPLETE'>('IDLE');
  const [currentPackCards, setCurrentPackCards] = useState<PersonCard[]>([]);
  const [activePackType, setActivePackType] = useState<PackType>('STANDARD');

  // Persistence State
  const [collection, setCollection] = useState<Record<string, CollectedCard>>({});
  const [packHistory, setPackHistory] = useState<PackHistoryItem[]>([]);
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile());

  // Settings
  const [settings, setSettings] = useState<AppSettings>({
    soundEnabled: soundManager.getSoundEnabled(),
    musicEnabled: soundManager.getMusicEnabled(),
    masterVolume: soundManager.getMasterVolume(),
    musicVolume: soundManager.getMusicVolume(),
    reducedMotion: false,
  });

  // Modals & FX
  const [selectedModalCard, setSelectedModalCard] = useState<CollectedCard | null>(null);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [burstTrigger, setBurstTrigger] = useState(0);
  const [burstType, setBurstType] = useState<'legendary' | 'epic' | 'gold'>('gold');

  // Load stored state on mount
  useEffect(() => {
    setCollection(getStoredCollection());
    setPackHistory(getStoredPackHistory());
    setProfile(getStoredProfile());

    // Check system prefers-reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSettings((prev) => ({ ...prev, reducedMotion: true }));
    }
  }, []);

  // Total Catalog Count including custom added cards
  const totalCatalogCount = useMemo(() => {
    return getAllAvailableCards().length;
  }, [collection, isAddCardModalOpen]);

  // Set of known card IDs in user's collection
  const knownCardIds = useMemo(() => {
    return new Set(Object.keys(collection));
  }, [collection]);

  // Start Pack Opening sequence
  const startPackOpening = useCallback((packType: PackType = 'STANDARD') => {
    soundManager.init();
    setActivePackType(packType);

    // Generate 5 cards according to pack rules
    const cards = generatePack(packType);
    setCurrentPackCards(cards);

    // Check for high rarities for particle trigger
    const hasLegendary = cards.some((c) => c.rarity === 'LEGENDARY');
    const hasEpic = cards.some((c) => c.rarity === 'EPIC' || c.rarity === 'ULTRA_RARE');

    if (hasLegendary) {
      setBurstType('legendary');
    } else if (hasEpic) {
      setBurstType('epic');
    } else {
      setBurstType('gold');
    }

    setGameMode('OPENING_ANIMATION');
  }, []);

  // When pack animation finishes -> go to Card Reveal
  const handlePackAnimationComplete = useCallback(() => {
    setGameMode('CARD_REVEAL');
  }, []);

  // When user completes revealing all 5 cards -> go to Pack Complete fan screen
  const handleFinishCardReveal = useCallback(() => {
    setGameMode('PACK_COMPLETE');
  }, []);

  // Add 5 cards to persistent collection & update history
  const handleAddToCollection = useCallback(() => {
    if (currentPackCards.length === 0) return;

    const { updatedCollection, newCardsCount } = addCardsToCollection(currentPackCards);
    setCollection({ ...updatedCollection });

    // Record pack in history
    const nextPackNumber = (packHistory[0]?.packNumber || 0) + 1;
    const historyItem: PackHistoryItem = {
      id: `pack-${Date.now()}`,
      packNumber: nextPackNumber,
      packName:
        activePackType === 'LEGENDARY_TEST'
          ? 'Celestial Sovereign Pack'
          : activePackType === 'GOD_PACK'
          ? 'All-Star God Pack'
          : activePackType === 'HIGH_ROLLER'
          ? 'Neon High-Roller Pack'
          : 'Person Booster Pack',
      openedAt: new Date().toISOString(),
      cards: currentPackCards,
      newCardsCount,
    };

    recordPackOpened(historyItem);
    setPackHistory((prev) => [historyItem, ...prev]);

    // Update Profile Stats
    const updatedProfile = updateStoredProfile({
      packsOpened: profile.packsOpened + 1,
      totalCardsCollected: profile.totalCardsCollected + currentPackCards.length,
      level: Math.floor((profile.packsOpened + 1) / 3) + 1,
    });
    setProfile(updatedProfile);

    // Trigger celebratory background particle burst
    setBurstTrigger((prev) => prev + 1);
  }, [currentPackCards, activePackType, packHistory, profile]);

  // Reset entire collection
  const handleResetCollection = useCallback(() => {
    resetEntireCollection();
    setCollection({});
    setPackHistory([]);
    setProfile(getStoredProfile());
    soundManager.playButtonClick();
  }, []);

  // New card added from Admin Modal
  const handleCustomCardAdded = useCallback((newCard: PersonCard) => {
    // Automatically add 1 copy to collection or make available in future packs
    addCardsToCollection([newCard]);
    setCollection(getStoredCollection());
    setBurstTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#07080d] text-neutral-100 flex flex-col font-sans overflow-x-hidden selection:bg-sky-500 selection:text-black">
      {/* Background Particle Canvas */}
      <ParticleCanvas
        burstTrigger={burstTrigger}
        burstType={burstType}
        reducedMotion={settings.reducedMotion}
      />

      {/* Primary Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setGameMode('IDLE'); // Return to standard page if opening
        }}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => {
          const next = !settings.soundEnabled;
          soundManager.setSoundEnabled(next);
          setSettings((prev) => ({ ...prev, soundEnabled: next }));
        }}
        musicEnabled={settings.musicEnabled}
        onToggleMusic={() => {
          const next = !settings.musicEnabled;
          soundManager.setMusicEnabled(next);
          setSettings((prev) => ({ ...prev, musicEnabled: next }));
        }}
        onOpenAddCard={() => setIsAddCardModalOpen(true)}
        totalCollectedCount={Object.keys(collection).length}
      />

      {/* Main Viewport Container */}
      <main className="relative z-10 flex-1 pt-14 md:pt-16 pb-16 md:pb-6 flex flex-col items-center">
        {/* GAMEPLAY OVERLAYS / VIEWS */}
        {gameMode === 'OPENING_ANIMATION' && (
          <PackOpening
            cards={currentPackCards}
            onComplete={handlePackAnimationComplete}
            reducedMotion={settings.reducedMotion}
          />
        )}

        {gameMode === 'CARD_REVEAL' && (
          <CardReveal
            cards={currentPackCards}
            knownCardIds={knownCardIds}
            onFinishPack={handleFinishCardReveal}
            reducedMotion={settings.reducedMotion}
          />
        )}

        {gameMode === 'PACK_COMPLETE' && (
          <PackComplete
            cards={currentPackCards}
            knownCardIds={knownCardIds}
            onAddToCollection={handleAddToCollection}
            onOpenAnother={() => startPackOpening(activePackType)}
            onViewCollection={() => {
              setGameMode('IDLE');
              setActiveTab('COLLECTION');
            }}
          />
        )}

        {/* REGULAR TAB PAGES (When not in active pack opening) */}
        {gameMode === 'IDLE' && (
          <>
            {activeTab === 'HOME' && (
              <Home
                onOpenPack={() => startPackOpening('STANDARD')}
                collection={collection}
                packsOpened={profile.packsOpened}
                totalUniqueCards={Object.keys(collection).length}
                totalCatalogCount={totalCatalogCount}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onSelectCard={(c) => setSelectedModalCard(c)}
              />
            )}

            {activeTab === 'COLLECTION' && (
              <Collection
                collection={collection}
                packsOpened={profile.packsOpened}
                totalCatalogCount={totalCatalogCount}
                onOpenFirstPack={() => startPackOpening('STANDARD')}
                onSelectCard={(c) => setSelectedModalCard(c)}
              />
            )}

            {activeTab === 'PACKS' && (
              <Packs
                onOpenSpecificPack={(pType) => startPackOpening(pType)}
                packHistory={packHistory}
              />
            )}

            {activeTab === 'PROFILE' && (
              <Profile
                profile={profile}
                collection={collection}
                totalCatalogCount={totalCatalogCount}
              />
            )}

            {activeTab === 'SETTINGS' && (
              <Settings
                settings={settings}
                onUpdateSettings={(newVals) =>
                  setSettings((prev) => ({ ...prev, ...newVals }))
                }
                onResetCollection={handleResetCollection}
                onOpenAddCard={() => setIsAddCardModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* --- DETAIL MODAL FOR INSPECTING A CARD --- */}
      {selectedModalCard && (
        <CardModal
          collectedCard={selectedModalCard}
          allCollected={Object.values(collection)}
          onClose={() => setSelectedModalCard(null)}
          onSelectCard={(card) => setSelectedModalCard(card)}
        />
      )}

      {/* --- ADMIN ADD CUSTOM CARD MODAL --- */}
      {isAddCardModalOpen && (
        <AdminAddCardModal
          onClose={() => setIsAddCardModalOpen(false)}
          onCardAdded={handleCustomCardAdded}
        />
      )}
    </div>
  );
}
