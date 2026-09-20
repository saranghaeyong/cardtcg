import React from 'react';
import { ActiveTab } from '../types';
import { soundManager } from '../utils/audio';
import {
  Home,
  Layers,
  Package,
  User,
  Settings,
  Volume2,
  VolumeX,
  Music,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
  onOpenAddCard: () => void;
  totalCollectedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  soundEnabled,
  onToggleSound,
  musicEnabled,
  onToggleMusic,
  onOpenAddCard,
  totalCollectedCount,
}) => {
  const handleNavClick = (tab: ActiveTab) => {
    soundManager.playButtonClick();
    onTabChange(tab);
  };

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'HOME', label: 'HOME', icon: Home },
    { id: 'COLLECTION', label: 'COLLECTION', icon: Layers },
    { id: 'PACKS', label: 'PACKS', icon: Package },
    { id: 'PROFILE', label: 'PROFILE', icon: User },
    { id: 'SETTINGS', label: 'SETTINGS', icon: Settings },
  ];

  return (
    <>
      {/* DESKTOP TOP BAR */}
      <header
        id="desktop-navbar"
        className="hidden md:flex fixed top-0 inset-x-0 z-40 h-16 items-center justify-between px-6 bg-[#090a12]/80 backdrop-blur-md border-b border-white/10 select-none"
      >
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('HOME')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-amber-400 p-0.5 shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="font-serif font-black tracking-[0.2em] text-sm text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 uppercase">
              PERSON CARD COLLECTION
            </div>
            <div className="text-[9px] font-mono tracking-widest text-sky-400 font-bold">
              DIGITAL TCG ARCHIVE
            </div>
          </div>
        </div>

        {/* Center Nav Items */}
        <nav className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id.toLowerCase()}`}
                onClick={() => handleNavClick(item.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'text-white bg-white/15 shadow-sm shadow-indigo-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : ''}`} />
                <span>{item.label}</span>
                {item.id === 'COLLECTION' && totalCollectedCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-indigo-500/40 text-indigo-300">
                    {totalCollectedCount}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-3 h-0.5 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Add Card, Sound Toggle, Music Toggle */}
        <div className="flex items-center gap-2">
          {/* Add Custom Person Card button */}
          <button
            id="open-add-card-btn"
            onClick={() => {
              soundManager.playButtonClick();
              onOpenAddCard();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500/20 to-indigo-500/20 hover:from-sky-500/30 hover:to-indigo-500/30 border border-sky-400/40 text-sky-300 text-xs font-mono font-bold tracking-wider transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>NEW CARD</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            id="toggle-sound-btn"
            onClick={() => {
              onToggleSound();
              soundManager.playButtonClick();
            }}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Music Toggle */}
          <button
            id="toggle-music-btn"
            onClick={() => {
              onToggleMusic();
              soundManager.playButtonClick();
            }}
            title={musicEnabled ? 'Pause Music' : 'Play Ambient Music'}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
              musicEnabled
                ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300'
                : 'bg-white/5 border-white/10 text-neutral-500'
            }`}
          >
            <Music className={`w-4 h-4 ${musicEnabled ? 'text-indigo-400 animate-pulse' : ''}`} />
          </button>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div
        id="mobile-navbar"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-[#090a12]/95 backdrop-blur-lg border-t border-white/10 flex items-center justify-around px-2 select-none"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-sky-400' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-mono font-bold tracking-wider">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* MOBILE TOP COMPACT BAR */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 h-14 bg-[#090a12]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 select-none">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span className="font-serif font-black text-xs tracking-widest text-white uppercase">
            PERSON CARDS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onOpenAddCard();
            }}
            className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[10px] font-mono font-bold flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>ADD</span>
          </button>

          <button
            onClick={() => {
              onToggleSound();
              soundManager.playButtonClick();
            }}
            className="p-1.5 rounded-lg bg-white/10 text-white"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>
        </div>
      </div>
    </>
  );
};
