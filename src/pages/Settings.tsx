import React, { useState } from 'react';
import { AppSettings } from '../types';
import { soundManager } from '../utils/audio';
import {
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Music,
  EyeOff,
  Trash2,
  AlertTriangle,
  PlusCircle,
  Check,
} from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetCollection: () => void;
  onOpenAddCard: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  onResetCollection,
  onOpenAddCard,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleToggleSound = () => {
    const next = !settings.soundEnabled;
    soundManager.setSoundEnabled(next);
    onUpdateSettings({ soundEnabled: next });
    if (next) soundManager.playButtonClick();
  };

  const handleToggleMusic = () => {
    const next = !settings.musicEnabled;
    soundManager.setMusicEnabled(next);
    onUpdateSettings({ musicEnabled: next });
    if (next) soundManager.playButtonClick();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    soundManager.setMasterVolume(vol);
    onUpdateSettings({ masterVolume: vol });
  };

  const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    soundManager.setMusicVolume(vol);
    onUpdateSettings({ musicVolume: vol });
  };

  const handleToggleReducedMotion = () => {
    onUpdateSettings({ reducedMotion: !settings.reducedMotion });
    soundManager.playButtonClick();
  };

  const handleConfirmReset = () => {
    onResetCollection();
    setShowConfirmReset(false);
  };

  return (
    <div
      id="settings-screen"
      className="relative min-h-[calc(100dvh-4rem)] w-full max-w-3xl mx-auto py-8 px-4 sm:px-6 select-none"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[10px] font-mono font-bold tracking-widest text-indigo-300 mb-2">
          <SettingsIcon className="w-3 h-3 text-sky-400" />
          <span>SYSTEM PREFERENCES</span>
        </div>
        <h1 className="text-3xl font-black font-serif uppercase tracking-wider text-white">
          SETTINGS & AUDIO
        </h1>
        <p className="text-xs sm:text-sm font-sans text-neutral-400 mt-1">
          Tune acoustics, visual effects, and manage local storage persistence.
        </p>
      </div>

      <div className="space-y-6">
        {/* --- AUDIO SECTION --- */}
        <div className="rounded-2xl bg-neutral-950/70 border border-white/10 p-5 sm:p-6 space-y-5">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-sky-400">
            Audio & Ambient Acoustics
          </h2>

          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-400">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
              </div>
              <div>
                <div className="text-sm font-bold text-white font-serif">Sound Effects</div>
                <div className="text-xs text-neutral-400 font-sans">
                  Pack tear, card flips, rarity chimes and fanfares.
                </div>
              </div>
            </div>
            <button
              onClick={handleToggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.soundEnabled ? 'bg-sky-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Sound FX Volume Slider */}
          {settings.soundEnabled && (
            <div className="space-y-1.5 pl-12">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-400">Master Volume</span>
                <span className="text-white font-bold">
                  {Math.round(settings.masterVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.masterVolume}
                onChange={handleVolumeChange}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>
          )}

          <div className="border-t border-white/10 pt-4" />

          {/* Ambient Music Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-white font-serif">
                  Ambient Mystery Music
                </div>
                <div className="text-xs text-neutral-400 font-sans">
                  Procedural cinematic background soundtrack synthesizer.
                </div>
              </div>
            </div>
            <button
              onClick={handleToggleMusic}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.musicEnabled ? 'bg-indigo-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.musicEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Music Volume Slider */}
          {settings.musicEnabled && (
            <div className="space-y-1.5 pl-12">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-400">Music Volume</span>
                <span className="text-white font-bold">
                  {Math.round(settings.musicVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.musicVolume}
                onChange={handleMusicVolumeChange}
                className="w-full accent-indigo-400 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* --- ACCESSIBILITY & VISUALS --- */}
        <div className="rounded-2xl bg-neutral-950/70 border border-white/10 p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-sky-400">
            Accessibility & Motion
          </h2>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300">
                <EyeOff className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-white font-serif">Reduced Motion</div>
                <div className="text-xs text-neutral-400 font-sans">
                  Disables intense 3D tilts and accelerates pack opening animations.
                </div>
              </div>
            </div>
            <button
              onClick={handleToggleReducedMotion}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.reducedMotion ? 'bg-sky-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* --- CARD MINTING / ADMIN --- */}
        <div className="rounded-2xl bg-neutral-950/70 border border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-white font-serif">
              Custom Person Card Maker
            </div>
            <div className="text-xs text-neutral-400 font-sans">
              Upload real photos and mint custom Person Cards into the booster pool.
            </div>
          </div>
          <button
            onClick={onOpenAddCard}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-mono font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>MINT NEW CARD</span>
          </button>
        </div>

        {/* --- DANGER ZONE / RESET COLLECTION --- */}
        <div className="rounded-2xl bg-red-950/20 border border-red-500/20 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-red-300 font-serif flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-400" />
                <span>Reset Collection Vault</span>
              </div>
              <div className="text-xs text-neutral-400 font-sans mt-0.5">
                Permanently wipes all collected cards and pack opening history from LocalStorage.
              </div>
            </div>

            <button
              onClick={() => setShowConfirmReset(true)}
              className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-mono font-bold text-xs uppercase cursor-pointer transition-all shrink-0"
            >
              RESET COLLECTION
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRM RESET MODAL */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-neutral-950 border border-red-500/40 p-6 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto mb-4 text-red-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black font-serif uppercase tracking-wider text-white">
              CONFIRM RESET?
            </h3>
            <p className="text-xs font-sans text-neutral-300 mt-2 leading-relaxed">
              This will erase all your unlocked Person Cards, duplicates count, and opened pack histories. This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all cursor-pointer"
              >
                CANCEL
              </button>

              <button
                onClick={handleConfirmReset}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-red-600/40"
              >
                YES, RESET ALL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
