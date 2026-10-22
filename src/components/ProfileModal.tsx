import { useState } from 'react';
import { X, Check, RotateCcw } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { AVATARS } from '../data/wonderData';
import { sound } from '../utils/sound';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { profile, updateName, updateAvatar, resetProgress } = useUser();
  const [name, setName] = useState<string>(profile.name);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      updateName(name.trim());
    }
    sound.play('success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <h3 className="text-xl font-bold text-white">Cadet Profile</h3>
          </div>
          <button
            onClick={() => {
              onClose();
              sound.play('click');
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Name input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block">
            Explorer Name:
          </label>
          <input
            type="text"
            value={name}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white font-extrabold text-base focus:outline-none focus:border-amber-400"
            placeholder="Enter your name"
          />
        </div>

        {/* Mascot Avatar Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block">
            Select Your Space Mascot:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {AVATARS.map(avatar => {
              const isSelected = profile.avatar === avatar.id;

              return (
                <button
                  key={avatar.id}
                  onClick={() => updateAvatar(avatar.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-center text-center gap-1.5 relative ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10 scale-105'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-3xl filter drop-shadow">{avatar.emoji}</span>
                  <div className="font-extrabold text-xs text-white leading-tight">
                    {avatar.name}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    {avatar.desc}
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (confirm('Reset all progress, badges, and score?')) {
                resetProgress();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs transition-all active:scale-95 shadow-lg shadow-amber-400/20"
          >
            Save Explorer Profile
          </button>
        </div>
      </div>
    </div>
  );
}
