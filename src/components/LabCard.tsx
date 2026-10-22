import { LabDefinition } from '../types';
import { useUser } from '../context/UserContext';
import { BADGES } from '../data/wonderData';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface LabCardProps {
  lab: LabDefinition;
  onSelect: () => void;
}

export function LabCard({ lab, onSelect }: LabCardProps) {
  const { profile } = useUser();
  const isCompleted = profile.completedLabs.includes(lab.id);
  const badge = BADGES.find(b => b.id === lab.badgeReward);

  return (
    <div
      onClick={() => {
        onSelect();
        sound.play('pop');
      }}
      className="group relative bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      {/* Background ambient gradient glow */}
      <div
        className="absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl opacity-15 pointer-events-none group-hover:opacity-30 transition-opacity"
        style={{ backgroundColor: lab.accentColor }}
      />

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/10 group-hover:scale-110 transition-transform"
            style={{ backgroundColor: `${lab.accentColor}20` }}
          >
            {lab.icon}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                lab.category === 'physics'
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              {lab.category}
            </span>

            {isCompleted && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                <span>Explored</span>
              </span>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
            {lab.title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            {lab.subtitle}
          </p>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {lab.summary}
        </p>

        {/* Learning Highlights */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
            What You'll Discover:
          </span>
          <div className="space-y-1">
            {lab.learningGoals.map((goal, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: lab.accentColor }} />
                <span className="truncate">{goal}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Badge & Action */}
      <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
        {badge && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400" title={`Unlocks badge: ${badge.name}`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-300 font-bold">{badge.icon} {badge.name}</span>
          </div>
        )}

        <div className="flex items-center gap-1 text-xs font-black text-amber-400 group-hover:translate-x-1 transition-transform ml-auto">
          <span>Enter Lab</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
