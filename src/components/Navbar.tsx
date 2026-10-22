import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { sound } from '../utils/sound';
import { AgeGroup, Category } from '../types';
import { Volume2, VolumeX, Trophy, Award, BookOpen, Sparkles, User } from 'lucide-react';
import { AVATARS } from '../data/wonderData';

interface NavbarProps {
  currentCategory: Category;
  onSelectCategory: (cat: Category) => void;
  ageFilter: AgeGroup | 'all';
  onSelectAgeFilter: (age: AgeGroup | 'all') => void;
  onOpenBadges: () => void;
  onOpenCertificate: () => void;
  onOpenFacts: () => void;
  onOpenProfile: () => void;
}

export function Navbar({
  currentCategory,
  onSelectCategory,
  ageFilter,
  onSelectAgeFilter,
  onOpenBadges,
  onOpenCertificate,
  onOpenFacts,
  onOpenProfile
}: NavbarProps) {
  const { profile } = useUser();
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  const currentAvatar = AVATARS.find(a => a.id === profile.avatar) || AVATARS[0];

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => {
            onSelectCategory('all');
            sound.play('pop');
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl">
              🪐
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-xl text-white tracking-wide">
                Wonder<span className="text-amber-400">Lab</span>
              </span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded font-extrabold uppercase">
                KIDS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Math & Physics Playground</p>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <nav className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800 gap-1 overflow-x-auto text-xs font-bold">
          {[
            { id: 'all', label: 'All Labs', emoji: '🌟' },
            { id: 'physics', label: 'Physics', emoji: '🚀' },
            { id: 'math', label: 'Math', emoji: '📐' },
            { id: 'quests', label: 'Cosmo Quest', emoji: '🧭' },
            { id: 'arcade', label: 'Speed Arcade', emoji: '⭐' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                onSelectCategory(tab.id as Category);
                sound.play('click');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                currentCategory === tab.id
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md font-extrabold shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Utility & Profile Controls */}
        <div className="flex items-center gap-2">
          {/* Age Group Filter Dropdown */}
          <select
            value={ageFilter}
            onChange={(e) => {
              onSelectAgeFilter(e.target.value as AgeGroup | 'all');
              sound.play('pop');
            }}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold py-1.5 px-2.5 rounded-xl focus:outline-none focus:border-amber-400 cursor-pointer"
            title="Filter by Recommended Age"
          >
            <option value="all">👶 All Ages</option>
            <option value="junior">🌱 Junior (Ages 5-7)</option>
            <option value="cadet">🚀 Cadet (Ages 8-10)</option>
            <option value="master">⚡ Master (Ages 11+)</option>
          </select>

          {/* Fact Cards Button */}
          <button
            onClick={() => {
              onOpenFacts();
              sound.play('pop');
            }}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5"
            title="Science & Math Why/How Cards"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">Science Facts</span>
          </button>

          {/* Badges Button */}
          <button
            onClick={() => {
              onOpenBadges();
              sound.play('pop');
            }}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 hover:border-amber-500/40 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5"
            title="Trophy Badges"
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden md:inline">Badges ({profile.badges.length})</span>
          </button>

          {/* Certificate Button */}
          <button
            onClick={() => {
              onOpenCertificate();
              sound.play('pop');
            }}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-purple-400 border border-slate-800 hover:border-purple-500/40 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5"
            title="Printable Diploma Certificate"
          >
            <Award className="w-4 h-4" />
            <span className="hidden lg:inline">Diploma</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border transition-all ${
              isMuted
                ? 'bg-rose-950/40 border-rose-800/60 text-rose-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Kid Profile Pill */}
          <button
            onClick={() => {
              onOpenProfile();
              sound.play('pop');
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 px-3 py-1.5 rounded-2xl transition-all group"
            title="Edit Explorer Avatar"
          >
            <span className="text-xl filter drop-shadow group-hover:scale-110 transition-transform">
              {currentAvatar.emoji}
            </span>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-black text-white flex items-center gap-1">
                <span>{profile.name}</span>
                <span className="text-[10px] text-amber-400 font-extrabold bg-amber-400/10 px-1.5 rounded">
                  Lvl {profile.level}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>{profile.xp} XP</span>
              </div>
            </div>
            <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
}
