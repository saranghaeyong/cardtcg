import React from 'react';
import { BoosterPack } from '../components/BoosterPack';
import { Card } from '../components/Card';
import { CollectedCard } from '../types';
import { soundManager } from '../utils/audio';
import { Sparkles, Layers, Package, Flame, ArrowRight, Shield } from 'lucide-react';

interface HomeProps {
  onOpenPack: () => void;
  collection: Record<string, CollectedCard>;
  packsOpened: number;
  totalUniqueCards: number;
  totalCatalogCount: number;
  onNavigateTab: (tab: 'COLLECTION' | 'PACKS') => void;
  onSelectCard: (card: CollectedCard) => void;
}

export const Home: React.FC<HomeProps> = ({
  onOpenPack,
  collection,
  packsOpened,
  totalUniqueCards,
  totalCatalogCount,
  onNavigateTab,
  onSelectCard,
}) => {
  const collectedList = Object.values(collection);
  // Get recent 4 collected cards
  const recentCards = [...collectedList]
    .sort(
      (a, b) =>
        new Date(b.lastDiscoveredAt).getTime() - new Date(a.lastDiscoveredAt).getTime()
    )
    .slice(0, 4);

  return (
    <div
      id="home-screen"
      className="relative min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-between py-6 px-4 select-none"
    >
      {/* Subtle Atmospheric Light Cone in background */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-b from-indigo-600/20 via-sky-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* --- HERO HEADER --- */}
      <div className="relative z-10 text-center max-w-2xl mt-2 sm:mt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-[11px] font-mono font-bold tracking-widest text-indigo-300 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>SERIES 1 • PERSON ARCHIVE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black font-serif tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 uppercase drop-shadow-sm">
          COLLECT THEM ALL
        </h1>

        <p className="text-sm sm:text-base font-sans text-neutral-300 mt-2 max-w-lg mx-auto font-medium">
          Open packs. Discover people. Build your ultimate digital card collection.
        </p>
      </div>

      {/* --- CENTER BOOSTER PACK SHOWCASE --- */}
      <div className="relative z-20 my-6 sm:my-8 flex flex-col items-center justify-center animate-float">
        <BoosterPack onOpen={onOpenPack} />

        {/* Primary Call To Action Button */}
        <div className="mt-6 flex items-center gap-3">
          <button
            id="open-pack-hero-btn"
            onClick={() => {
              soundManager.playPackClick();
              onOpenPack();
            }}
            className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 hover:from-sky-300 hover:to-purple-400 text-slate-950 font-black font-serif tracking-[0.2em] text-sm uppercase shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>OPEN BOOSTER PACK</span>
          </button>
        </div>
      </div>

      {/* --- STATS STRIP --- */}
      <div className="relative z-10 w-full max-w-3xl grid grid-cols-3 gap-3 p-3 rounded-2xl bg-neutral-950/60 border border-white/10 backdrop-blur-md mb-6">
        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-sky-400" /> Unique Cards
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
            {totalUniqueCards}{' '}
            <span className="text-xs text-neutral-400 font-normal">/ {totalCatalogCount}</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            <Package className="w-3.5 h-3.5 text-indigo-400" /> Packs Opened
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
            {packsOpened}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Vault Completion
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono mt-0.5">
            {totalCatalogCount > 0
              ? Math.round((totalUniqueCards / totalCatalogCount) * 100)
              : 0}
            %
          </div>
        </div>
      </div>

      {/* --- RECENT PULLS STRIP (If user has collected cards) --- */}
      {recentCards.length > 0 && (
        <div className="relative z-10 w-full max-w-4xl pb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-sky-400" /> Recently Discovered
            </span>
            <button
              onClick={() => onNavigateTab('COLLECTION')}
              className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recentCards.map((c) => (
              <div
                key={c.cardId}
                onClick={() => onSelectCard(c)}
                className="cursor-pointer hover:scale-102 transition-transform"
              >
                <Card card={c.card} copies={c.copies} size="sm" interactiveTilt={false} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
