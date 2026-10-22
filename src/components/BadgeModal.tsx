import { X, CheckCircle2, Lock } from 'lucide-react';
import { BADGES } from '../data/wonderData';
import { useUser } from '../context/UserContext';
import { sound } from '../utils/sound';

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BadgeModal({ isOpen, onClose }: BadgeModalProps) {
  const { profile } = useUser();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🏆</span>
            <div>
              <h3 className="text-xl font-bold text-white">Galactic Trophy Room</h3>
              <p className="text-xs text-slate-400">
                Unlocked {profile.badges.length} of {BADGES.length} Badges
              </p>
            </div>
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

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BADGES.map(badge => {
            const isUnlocked = profile.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-slate-950/80 border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked
                      ? `bg-gradient-to-tr ${badge.color} shadow-md`
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isUnlocked ? badge.icon : <Lock className="w-5 h-5 text-slate-500" />}
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-white truncate">
                      {badge.name}
                    </span>
                    {isUnlocked && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">
                    {badge.description}
                  </p>
                  <div className="text-[10px] text-amber-400/80 pt-0.5">
                    Requirement: {badge.requirement}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
