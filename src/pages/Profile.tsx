import React from 'react';
import { CollectedCard, UserProfile } from '../types';
import { RARITIES } from '../data/rarity';
import {
  User,
  Crown,
  Sparkles,
  Package,
  Layers,
  Award,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ProfileProps {
  profile: UserProfile;
  collection: Record<string, CollectedCard>;
  totalCatalogCount: number;
}

export const Profile: React.FC<ProfileProps> = ({
  profile,
  collection,
  totalCatalogCount,
}) => {
  const collectedList = Object.values(collection);
  const totalUnique = collectedList.length;
  const completionPercentage = totalCatalogCount > 0
    ? Math.min(100, Math.round((totalUnique / totalCatalogCount) * 100))
    : 0;

  // Counts by rarity
  const rarityCounts = {
    COMMON: collectedList.filter((c) => c.card.rarity === 'COMMON').length,
    UNCOMMON: collectedList.filter((c) => c.card.rarity === 'UNCOMMON').length,
    RARE: collectedList.filter((c) => c.card.rarity === 'RARE').length,
    EPIC: collectedList.filter((c) => c.card.rarity === 'EPIC').length,
    ULTRA_RARE: collectedList.filter((c) => c.card.rarity === 'ULTRA_RARE').length,
    LEGENDARY: collectedList.filter((c) => c.card.rarity === 'LEGENDARY').length,
  };

  // Determine Rank based on collection
  const getRank = () => {
    if (rarityCounts.LEGENDARY >= 2) return 'Grandmaster Archivist';
    if (rarityCounts.LEGENDARY >= 1) return 'Master Collector';
    if (rarityCounts.EPIC >= 3) return 'Elite Vanguard';
    if (rarityCounts.RARE >= 3) return 'Seasoned Gatherer';
    if (totalUnique >= 3) return 'Apprentice Seeker';
    return 'Novice Collector';
  };

  return (
    <div
      id="profile-screen"
      className="relative min-h-[calc(100dvh-4rem)] w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 select-none"
    >
      {/* Profile Card Header */}
      <div className="relative rounded-3xl bg-neutral-950/80 border border-white/15 p-6 sm:p-8 backdrop-blur-md shadow-2xl mb-8 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-600/20 via-sky-600/10 to-transparent blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar with glowing ring */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-indigo-400/50 shadow-xl p-0.5 bg-gradient-to-tr from-indigo-500 via-sky-400 to-amber-400">
              <img
                src={profile.avatar}
                alt="Profile Avatar"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-amber-500 text-black text-[10px] font-mono font-black uppercase shadow-md">
              LVL {profile.level}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-[11px] font-mono font-bold tracking-widest text-sky-400 uppercase">
                PERSON COLLECTOR ID #001
              </span>
              <ShieldCheck className="w-4 h-4 text-sky-400" />
            </div>

            <h1 className="text-3xl font-black font-serif uppercase tracking-wider text-white">
              {profile.name}
            </h1>
            <p className="text-xs font-mono text-indigo-300 font-bold mt-0.5">
              Rank: {getRank()}
            </p>

            {/* Collection Completion Progress Bar */}
            <div className="mt-5 space-y-1.5 max-w-lg">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-300 font-bold">Collection Completion</span>
                <span className="text-sky-400 font-bold font-mono">
                  {completionPercentage}% ({totalUnique} / {totalCatalogCount} Cards)
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- STATS SUMMARY TILES --- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/10 text-center">
          <Package className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
            Packs Opened
          </span>
          <span className="text-2xl font-bold font-mono text-white mt-0.5 block">
            {profile.packsOpened}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/10 text-center">
          <Layers className="w-5 h-5 text-sky-400 mx-auto mb-1.5" />
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
            Cards Discovered
          </span>
          <span className="text-2xl font-bold font-mono text-white mt-0.5 block">
            {totalUnique}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/10 text-center">
          <Sparkles className="w-5 h-5 text-rose-400 mx-auto mb-1.5" />
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
            Ultra Rare
          </span>
          <span className="text-2xl font-bold font-mono text-rose-400 mt-0.5 block">
            {rarityCounts.ULTRA_RARE}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/10 text-center">
          <Crown className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
            Legendary
          </span>
          <span className="text-2xl font-bold font-mono text-amber-400 mt-0.5 block">
            {rarityCounts.LEGENDARY}
          </span>
        </div>
      </div>

      {/* --- RARITY BREAKDOWN LIST (Requirement #19) --- */}
      <div className="rounded-2xl bg-neutral-950/60 border border-white/10 p-6">
        <h2 className="text-base font-bold font-serif uppercase tracking-wider text-white mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-sky-400" />
          <span>RARITY ARCHIVE AUDIT</span>
        </h2>

        <div className="space-y-3">
          {(Object.keys(RARITIES) as (keyof typeof RARITIES)[]).map((rKey) => {
            const rInfo = RARITIES[rKey];
            const count = rarityCounts[rKey];
            return (
              <div
                key={rKey}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: rInfo.color }}
                  />
                  <span className="text-xs font-mono font-bold tracking-wider text-white">
                    {rInfo.label}
                  </span>
                </div>
                <div className="text-xs font-mono">
                  <strong className="text-white text-sm">{count}</strong>{' '}
                  <span className="text-neutral-500">Collected</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
