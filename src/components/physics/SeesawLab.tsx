import { useState } from 'react';
import { RotateCcw, Sparkles, CheckCircle, HelpCircle, Trophy } from 'lucide-react';
import { sound } from '../../utils/sound';
import { fireCelebration } from '../../utils/confetti';
import { useUser } from '../../context/UserContext';

interface WeightItem {
  id: string;
  name: string;
  emoji: string;
  mass: number;
}

const AVAILABLE_WEIGHTS: WeightItem[] = [
  { id: 'apple', name: 'Apple', emoji: '🍎', mass: 1 },
  { id: 'cat', name: 'Kitten', emoji: '🐱', mass: 2 },
  { id: 'panda', name: 'Panda', emoji: '🐼', mass: 5 },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', mass: 10 },
  { id: 'gold', name: 'Gold Chest', emoji: '👑', mass: 15 },
];

const NOTCHES = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];

export function SeesawLab() {
  const { addXp, unlockBadge, completeLab } = useUser();

  // Slots: notch distance (-5 to 5) -> array of WeightItem
  const [placedWeights, setPlacedWeights] = useState<Record<number, WeightItem[]>>({
    '-4': [{ id: 'apple', name: 'Apple', emoji: '🍎', mass: 1 }],
    '2': [{ id: 'cat', name: 'Kitten', emoji: '🐱', mass: 2 }]
  });

  const [selectedWeight, setSelectedWeight] = useState<WeightItem>(AVAILABLE_WEIGHTS[0]);
  const [mode, setMode] = useState<'sandbox' | 'challenge'>('sandbox');
  const [challengeIndex, setChallengeIndex] = useState<number>(0);
  const [challengeSolved, setChallengeSolved] = useState<boolean>(false);

  const CHALLENGES: {
    title: string;
    instruction: string;
    setup: Record<number, WeightItem[]>;
    hint: string;
  }[] = [
    {
      title: 'Level 1: The Apple Counterweight',
      instruction: 'A Panda (5 kg) is sitting at slot -2. Balance the seesaw by placing one or more Apples (1 kg) on the right side!',
      setup: { [-2]: [{ id: 'panda', name: 'Panda', emoji: '🐼', mass: 5 }] },
      hint: 'Torque = 5 kg × 2 = 10. Where can you place 1 kg apples to make 10?'
    },
    {
      title: 'Level 2: The Mighty Elephant',
      instruction: 'An Elephant (10 kg) is sitting at slot -1. Balance the seesaw using only Kittens (2 kg each)!',
      setup: { [-1]: [{ id: 'elephant', name: 'Elephant', emoji: '🐘', mass: 10 }] },
      hint: 'Elephant torque = 10 × 1 = 10. Can you put a Kitten at slot +5 (2 × 5 = 10)?'
    },
    {
      title: 'Level 3: Lever Advantage',
      instruction: 'A Gold Chest (15 kg) is at slot -1. Can you balance it using a light Panda (5 kg)?',
      setup: { [-1]: [{ id: 'gold', name: 'Gold Chest', emoji: '👑', mass: 15 }] },
      hint: 'Left torque = 15. Where should a 5 kg Panda go so 5 × distance = 15?'
    }
  ];

  // Calculate torques
  const leftTorque = NOTCHES.filter(n => n < 0).reduce((acc, notch) => {
    const items = placedWeights[notch] || [];
    const sumMass = items.reduce((s, i) => s + i.mass, 0);
    return acc + sumMass * Math.abs(notch);
  }, 0);

  const rightTorque = NOTCHES.filter(n => n > 0).reduce((acc, notch) => {
    const items = placedWeights[notch] || [];
    const sumMass = items.reduce((s, i) => s + i.mass, 0);
    return acc + sumMass * notch;
  }, 0);

  const torqueDiff = rightTorque - leftTorque;
  const isBalanced = (leftTorque > 0 || rightTorque > 0) && torqueDiff === 0;

  // Visual tilt angle (capped between -18 and 18 degrees)
  const tiltAngle = Math.max(-18, Math.min(18, torqueDiff * 2.2));

  const handlePlaceWeight = (notch: number) => {
    sound.play('pop');
    setPlacedWeights(prev => {
      const current = prev[notch] || [];
      if (current.length >= 4) return prev; // max 4 items per notch
      return {
        ...prev,
        [notch]: [...current, selectedWeight]
      };
    });

    checkBalanceReward();
  };

  const handleRemoveTop = (notch: number) => {
    sound.play('click');
    setPlacedWeights(prev => {
      const current = prev[notch] || [];
      if (current.length === 0) return prev;
      return {
        ...prev,
        [notch]: current.slice(0, current.length - 1)
      };
    });
  };

  const clearAll = () => {
    sound.play('boing');
    setPlacedWeights({});
    setChallengeSolved(false);
  };

  const startChallenge = (idx: number) => {
    setChallengeIndex(idx);
    setPlacedWeights(CHALLENGES[idx].setup);
    setChallengeSolved(false);
    setMode('challenge');
    sound.play('chime');
  };

  const checkBalanceReward = () => {
    setTimeout(() => {
      // Re-evaluate
      const l = NOTCHES.filter(n => n < 0).reduce((acc, notch) => {
        const items = placedWeights[notch] || [];
        return acc + items.reduce((s, i) => s + i.mass, 0) * Math.abs(notch);
      }, 0);
      const r = NOTCHES.filter(n => n > 0).reduce((acc, notch) => {
        const items = placedWeights[notch] || [];
        return acc + items.reduce((s, i) => s + i.mass, 0) * notch;
      }, 0);

      if (l > 0 && r > 0 && l === r) {
        sound.play('fanfare');
        fireCelebration();
        unlockBadge('badge_balance');
        completeLab('seesaw');
        addXp(30, 'Balanced the seesaw with torque equilibrium!');
        if (mode === 'challenge') {
          setChallengeSolved(true);
        }
      }
    }, 150);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">⚖️</span>
            <h2 className="text-2xl font-bold text-white tracking-wide">Seesaw & Torque Balance</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Discover Archimedes' secret: <strong>Torque = Mass × Distance</strong>! Make the seesaw level.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 gap-2">
          <button
            onClick={() => {
              setMode('sandbox');
              sound.play('click');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'sandbox'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎨 Free Sandbox
          </button>
          <button
            onClick={() => startChallenge(0)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              mode === 'challenge'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Puzzle Challenge</span>
          </button>
        </div>
      </div>

      {/* Challenge Card if Challenge Mode active */}
      {mode === 'challenge' && (
        <div className="bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-slate-900 border border-amber-500/30 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {CHALLENGES[challengeIndex].title}
            </span>
            <div className="flex gap-1.5">
              {CHALLENGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => startChallenge(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    challengeIndex === idx
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
          <p className="text-white font-medium text-sm">
            {CHALLENGES[challengeIndex].instruction}
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-300/80 pt-1">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>Hint: {CHALLENGES[challengeIndex].hint}</span>
          </div>
          {challengeSolved && (
            <div className="bg-emerald-950/60 border border-emerald-500/50 p-2.5 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Challenge Solved! You balanced the torques perfectly!</span>
            </div>
          )}
        </div>
      )}

      {/* Main Interactive Seesaw Stage */}
      <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-8 min-h-[340px] flex flex-col justify-end items-center overflow-hidden">
        {/* Background Grid & Sky */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Live Torque Balance Indicator */}
        <div className="absolute top-4 inset-x-4 flex justify-between items-center text-xs sm:text-sm font-bold z-10">
          <div className="bg-cyan-950/80 border border-cyan-800 px-3.5 py-1.5 rounded-xl text-cyan-300 backdrop-blur-md">
            Left Torque: <span className="text-cyan-100 text-base font-black">{leftTorque}</span> N·m
          </div>

          <div
            className={`px-4 py-1.5 rounded-full border text-xs sm:text-sm font-black transition-all ${
              isBalanced
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-105 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {isBalanced ? '✨ PERFECT BALANCE! ⚖️' : torqueDiff > 0 ? 'Right Side Heavier ↘' : torqueDiff < 0 ? '↙ Left Side Heavier' : 'Add weights to test!'}
          </div>

          <div className="bg-purple-950/80 border border-purple-800 px-3.5 py-1.5 rounded-xl text-purple-300 backdrop-blur-md">
            Right Torque: <span className="text-purple-100 text-base font-black">{rightTorque}</span> N·m
          </div>
        </div>

        {/* Seesaw Planks and Weights with dynamic rotation */}
        <div className="relative w-full max-w-[620px] mb-12 flex justify-center items-center">
          {/* Rotatable Beam */}
          <div
            className="w-full h-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 rounded-full shadow-2xl transition-transform duration-300 ease-out relative flex items-center justify-between px-3"
            style={{
              transform: `rotate(${tiltAngle}deg)`,
              transformOrigin: '50% 50%'
            }}
          >
            {/* Center Fulcrum Bolt */}
            <div className="absolute left-1/2 -translate-x-1/2 w-5 h-5 bg-slate-900 border-2 border-amber-300 rounded-full z-20 shadow-md" />

            {/* Notches along beam */}
            {NOTCHES.map(notch => {
              const items = placedWeights[notch] || [];
              const isLeft = notch < 0;

              return (
                <div
                  key={notch}
                  onClick={() => handlePlaceWeight(notch)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleRemoveTop(notch);
                  }}
                  className={`group relative flex flex-col items-center cursor-pointer py-1 px-1 rounded-md transition-all ${
                    isLeft ? 'hover:bg-cyan-500/20' : 'hover:bg-purple-500/20'
                  }`}
                  title={`Slot ${notch} (${Math.abs(notch)}m from center). Left click to add, right click to remove.`}
                >
                  {/* Stacked weights on notch */}
                  <div className="absolute bottom-6 flex flex-col-reverse items-center gap-0.5">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="animate-bounce-slight transition-all text-2xl select-none filter drop-shadow-md hover:scale-125"
                      >
                        {item.emoji}
                      </div>
                    ))}
                  </div>

                  {/* Distance Notch Mark */}
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-white/60 mb-0.5 group-hover:scale-125 transition-transform" />
                  <span className="text-[10px] font-black text-white/90">
                    {notch > 0 ? `+${notch}` : notch}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Fulcrum Stand (Triangle Pivot) */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
            <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[50px] border-b-slate-700 filter drop-shadow-lg" />
            <div className="w-24 h-3 bg-slate-850 rounded-full border border-slate-700 -mt-1" />
          </div>
        </div>

        {/* Tip text */}
        <div className="text-center text-[11px] text-slate-500 pt-3">
          💡 Click a notch number to place selected weight. Right-click or use reset to remove.
        </div>
      </div>

      {/* Weight Selector & Action Palette */}
      <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mr-2">
            Select Weight:
          </span>
          {AVAILABLE_WEIGHTS.map(weight => (
            <button
              key={weight.id}
              onClick={() => {
                setSelectedWeight(weight);
                sound.play('pop');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedWeight.id === weight.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 scale-105'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span className="text-xl">{weight.emoji}</span>
              <div>
                <div>{weight.name}</div>
                <div className="text-[10px] text-cyan-400">{weight.mass} kg</div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all active:scale-95 ml-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear Board</span>
        </button>
      </div>

      {/* Educational Secret Panel */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-900 border border-cyan-800/40 p-4 rounded-2xl flex items-start gap-3">
        <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-slate-300 space-y-1">
          <div className="font-bold text-cyan-300">The Power of Levers:</div>
          <div>
            Torque is rotational force. It depends on <strong>how heavy</strong> an object is AND <strong>how far</strong> it sits from the pivot center!
            A light 1 kg Apple at slot 5 has the exact same turning force as a 5 kg Panda sitting right at slot 1!
          </div>
        </div>
      </div>
    </div>
  );
}
