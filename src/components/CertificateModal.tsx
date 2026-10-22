import { useState } from 'react';
import { X, Printer, Sparkles, Award } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { sound } from '../utils/sound';
import { AVATARS } from '../data/wonderData';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CertificateModal({ isOpen, onClose }: CertificateModalProps) {
  const { profile, updateName } = useUser();
  const [kidName, setKidName] = useState<string>(profile.name);
  const currentAvatar = AVATARS.find(a => a.id === profile.avatar) || AVATARS[0];

  if (!isOpen) return null;

  const handlePrint = () => {
    sound.play('chime');
    window.print();
  };

  const handleNameSave = (val: string) => {
    setKidName(val);
    updateName(val);
  };

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md print:p-0 print:bg-white">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[95vh] overflow-y-auto print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Controls - Hidden on print */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Junior Scientist Diploma</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Diploma</span>
            </button>
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
        </div>

        {/* Name input pill - Hidden on print */}
        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 print:hidden text-xs">
          <span className="text-slate-400 font-bold shrink-0">Recipient Name:</span>
          <input
            type="text"
            value={kidName}
            onChange={(e) => handleNameSave(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-extrabold focus:outline-none focus:border-purple-400"
            placeholder="Enter Child's Name"
          />
        </div>

        {/* Printable Certificate Frame */}
        <div className="relative bg-gradient-to-b from-amber-50 to-orange-50 text-slate-900 p-8 sm:p-12 rounded-3xl border-8 border-double border-amber-600 shadow-2xl text-center space-y-6 overflow-hidden">
          {/* Subtle cosmic watermarks */}
          <div className="absolute top-4 left-4 text-4xl opacity-20 select-none">🪐</div>
          <div className="absolute top-4 right-4 text-4xl opacity-20 select-none">🚀</div>
          <div className="absolute bottom-4 left-4 text-4xl opacity-20 select-none">📐</div>
          <div className="absolute bottom-4 right-4 text-4xl opacity-20 select-none">⭐</div>

          {/* Certificate Header */}
          <div className="space-y-1">
            <div className="text-xs font-black tracking-widest text-amber-700 uppercase">
              WONDERLAB ACADEMY OF SCIENCE & MATHEMATICS
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-amber-950 tracking-wide font-heading">
              Galactic Diploma of Excellence
            </h2>
            <p className="text-xs text-amber-800 italic">
              This prestigious certificate is proudly conferred upon
            </p>
          </div>

          {/* Recipient Name Ribbon */}
          <div className="py-2 border-b-2 border-amber-600 max-w-sm mx-auto">
            <span className="text-2xl sm:text-3xl font-black text-slate-950 font-heading">
              {kidName || 'Star Explorer'}
            </span>
          </div>

          {/* Award Description */}
          <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
            For outstanding curiosity, deductive reasoning, and problem-solving mastery in{' '}
            <strong>Planetary Gravity, Torque & Balance, Optics, Kinetic Energy, Electric Circuits, Fractions, and Geometry</strong>.
          </p>

          {/* Badges / Stats Banner */}
          <div className="flex justify-center items-center gap-6 pt-2">
            <div className="flex flex-col items-center">
              <span className="text-3xl filter drop-shadow">{currentAvatar.emoji}</span>
              <span className="text-[10px] font-bold text-amber-900">Rank: Level {profile.level}</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-amber-700">{profile.badges.length}</span>
              <span className="text-[10px] font-bold text-amber-900">Badges Earned</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-amber-700">{profile.xp}</span>
              <span className="text-[10px] font-bold text-amber-900">Cosmic XP</span>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 border-t border-amber-200 flex justify-between items-end text-xs">
            <div className="text-left space-y-0.5">
              <div className="font-bold text-slate-900 font-mono text-[11px]">{today}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Date Granted</div>
            </div>

            {/* Official Gold Seal */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 border-2 border-amber-600 flex items-center justify-center shadow-lg transform -rotate-12">
              <div className="text-center">
                <Sparkles className="w-4 h-4 mx-auto text-amber-950" />
                <span className="text-[8px] font-black text-amber-950 uppercase tracking-tighter">
                  VERIFIED
                </span>
              </div>
            </div>

            <div className="text-right space-y-0.5">
              <div className="font-heading font-black text-slate-900 text-sm">Nova the Bot</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Director of Science</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
