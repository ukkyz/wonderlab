import { useState } from 'react';
import { Sparkles, RotateCcw, Utensils } from 'lucide-react';
import { sound } from '../../utils/sound';
import { fireCelebration } from '../../utils/confetti';
import { useUser } from '../../context/UserContext';

const SLICE_OPTIONS = [2, 3, 4, 6, 8, 10];

interface MonsterOrder {
  targetNumerator: number;
  targetDenominator: number;
  monsterName: string;
  monsterEmoji: string;
  flavor: string;
}

const ORDERS: MonsterOrder[] = [
  { targetNumerator: 3, targetDenominator: 4, monsterName: 'Grumble', monsterEmoji: '👾', flavor: 'Starry Pepperoni' },
  { targetNumerator: 1, targetDenominator: 2, monsterName: 'Zorblax', monsterEmoji: '🐙', flavor: 'Cosmic Cheese' },
  { targetNumerator: 2, targetDenominator: 3, monsterName: 'Bloop', monsterEmoji: '🦕', flavor: 'Moon Mushroom' },
  { targetNumerator: 5, targetDenominator: 8, monsterName: 'Nebula', monsterEmoji: '🦄', flavor: 'Solar Veggie' },
];

export function FractionBakery() {
  const { addXp, unlockBadge, completeLab } = useUser();

  const [totalSlices, setTotalSlices] = useState<number>(4);
  const [selectedSlices, setSelectedSlices] = useState<Set<number>>(new Set([0, 1, 2]));
  const [orderIndex, setOrderIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentOrder = ORDERS[orderIndex];

  // Fraction value
  const numSelected = selectedSlices.size;
  const currentFractionVal = numSelected / totalSlices;
  const targetFractionVal = currentOrder.targetNumerator / currentOrder.targetDenominator;

  const isExactOrEquivalent = Math.abs(currentFractionVal - targetFractionVal) < 0.001;

  const toggleSlice = (idx: number) => {
    sound.play('pop');
    setSelectedSlices(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
    setFeedback(null);
  };

  const handleSliceCountChange = (count: number) => {
    sound.play('click');
    setTotalSlices(count);
    // keep selected slices within range
    setSelectedSlices(new Set([0]));
    setFeedback(null);
  };

  const handleFeedMonster = () => {
    if (isExactOrEquivalent) {
      sound.play('fanfare');
      fireCelebration();
      setFeedback(`🎉 Perfect! ${currentOrder.monsterName} loves it! (${numSelected}/${totalSlices} = ${currentOrder.targetNumerator}/${currentOrder.targetDenominator})`);
      addXp(35, 'Fed monster the exact target fraction!');
      unlockBadge('badge_fractions');
      completeLab('fractions');

      // Next order
      setTimeout(() => {
        setOrderIndex((prev) => (prev + 1) % ORDERS.length);
        setFeedback(null);
      }, 2400);
    } else {
      sound.play('gentleBoop');
      const need = currentOrder.targetNumerator / currentOrder.targetDenominator;
      setFeedback(
        currentFractionVal < need
          ? `Hungry! ${currentOrder.monsterName} needs more slices (${currentOrder.targetNumerator}/${currentOrder.targetDenominator})!`
          : `Too much food! You selected ${numSelected}/${totalSlices}, but ${currentOrder.monsterName} only wants ${currentOrder.targetNumerator}/${currentOrder.targetDenominator}.`
      );
    }
  };

  const handleReset = () => {
    setSelectedSlices(new Set());
    setFeedback(null);
    sound.play('click');
  };

  // Generate SVG slice paths for pizza
  const radius = 130;
  const center = 150;

  const getSlicePath = (index: number, total: number) => {
    const anglePerSlice = (2 * Math.PI) / total;
    const startAngle = index * anglePerSlice - Math.PI / 2;
    const endAngle = (index + 1) * anglePerSlice - Math.PI / 2;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const largeArc = anglePerSlice > Math.PI ? 1 : 0;
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🍕</span>
            <h2 className="text-2xl font-bold text-white tracking-wide">Pizza & Fraction Bakery</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Cut delicious pizzas, click slices to serve, and discover equivalent fractions!
          </p>
        </div>

        {/* Monster Customer Order Card */}
        <div className="bg-gradient-to-r from-rose-950/60 to-purple-950/60 border border-rose-500/30 px-4 py-2.5 rounded-2xl flex items-center gap-3 backdrop-blur-md shadow-lg">
          <span className="text-3xl filter drop-shadow animate-bounce-slight">{currentOrder.monsterEmoji}</span>
          <div>
            <div className="text-[11px] font-bold text-rose-300 uppercase">
              {currentOrder.monsterName}'s Order:
            </div>
            <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <span>{currentOrder.flavor}</span>
              <span className="bg-rose-500 text-slate-950 px-2 py-0.5 rounded-lg text-xs font-black">
                {currentOrder.targetNumerator}/{currentOrder.targetDenominator}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Bakery Kitchen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Pizza Slicer SVG */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center relative min-h-[360px]">
          <svg className="w-full max-w-[320px] aspect-square" viewBox="0 0 300 300">
            {/* Crust shadow */}
            <circle cx={center} cy={center} r={radius + 8} fill="#78350f" opacity="0.3" />

            {/* Pizza Crust Edge */}
            <circle cx={center} cy={center} r={radius + 4} fill="#d97706" />

            {/* Pizza Slices */}
            {Array.from({ length: totalSlices }).map((_, idx) => {
              const isSelected = selectedSlices.has(idx);
              const pathD = getSlicePath(idx, totalSlices);

              // Calculate slice center for topping
              const midAngle = (idx + 0.5) * ((2 * Math.PI) / totalSlices) - Math.PI / 2;
              const toppingX = center + (radius * 0.6) * Math.cos(midAngle);
              const toppingY = center + (radius * 0.6) * Math.sin(midAngle);

              return (
                <g
                  key={idx}
                  onClick={() => toggleSlice(idx)}
                  className="cursor-pointer transition-transform duration-200 hover:opacity-90 group"
                >
                  <path
                    d={pathD}
                    fill={isSelected ? '#fbbf24' : '#f59e0b'}
                    stroke="#b45309"
                    strokeWidth="3"
                    className={`transition-colors duration-200 ${
                      isSelected ? 'filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : ''
                    }`}
                  />

                  {/* Pepperoni Topping */}
                  <circle
                    cx={toppingX}
                    cy={toppingY}
                    r="9"
                    fill={isSelected ? '#dc2626' : '#991b1b'}
                    stroke="#7f1d1d"
                    strokeWidth="1.5"
                    className="transition-colors"
                  />
                  <circle cx={toppingX - 2} cy={toppingY - 2} r="2" fill="#ef4444" />

                  {/* Slice Index Badge */}
                  <text
                    x={center + (radius * 0.85) * Math.cos(midAngle)}
                    y={center + (radius * 0.85) * Math.sin(midAngle) + 4}
                    textAnchor="middle"
                    fill={isSelected ? '#78350f' : '#ffffff'}
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="Fredoka"
                  >
                    {idx + 1}
                  </text>
                </g>
              );
            })}

            {/* Center Pizza Hub */}
            <circle cx={center} cy={center} r="10" fill="#b45309" />
          </svg>

          {/* Action Prompt */}
          <div className="text-center text-xs text-slate-400 mt-2">
            👉 Tap pizza slices to pick or unpick them!
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div className="mt-3 bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold text-center text-white animate-bounce-slight shadow-xl">
              {feedback}
            </div>
          )}
        </div>

        {/* Fraction Synchronizer & Equivalence Bar */}
        <div className="lg:col-span-5 space-y-4">
          {/* Fraction Representation Box */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-around">
            {/* Fraction Number */}
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-amber-400">{numSelected}</span>
              <div className="w-16 h-1.5 bg-slate-700 rounded-full my-1" />
              <span className="text-4xl font-black text-rose-400">{totalSlices}</span>
            </div>

            {/* Meaning breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-slate-300">
                  <strong>Numerator:</strong> {numSelected} slices served
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="text-slate-300">
                  <strong>Denominator:</strong> {totalSlices} total slices
                </span>
              </div>
              <div className="pt-1 text-slate-400 font-mono text-[11px]">
                Value: {(currentFractionVal * 100).toFixed(0)}% ({currentFractionVal.toFixed(2)})
              </div>
            </div>
          </div>

          {/* Synchronized Fraction Bar (Linear representation) */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span>FRACTION BAR VIEW</span>
              <span className="text-amber-400 font-mono">{numSelected} of {totalSlices}</span>
            </div>
            <div className="grid h-8 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-0.5 gap-1"
                 style={{ gridTemplateColumns: `repeat(${totalSlices}, 1fr)` }}>
              {Array.from({ length: totalSlices }).map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleSlice(idx)}
                  className={`h-full rounded-md cursor-pointer transition-all ${
                    selectedSlices.has(idx)
                      ? 'bg-gradient-to-r from-amber-400 to-orange-400 shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Feed Monster & Reset Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleFeedMonster}
              className="flex-1 py-3 px-4 rounded-2xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 transition-all active:scale-95 shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
            >
              <Utensils className="w-4 h-4" />
              <span>Feed {currentOrder.monsterName}!</span>
            </button>
            <button
              onClick={handleReset}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 transition-all active:scale-95"
              title="Reset Slices"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slice Count Chooser */}
      <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
          Cut Pizza into Equal Parts:
        </span>
        <div className="flex flex-wrap gap-2">
          {SLICE_OPTIONS.map(count => (
            <button
              key={count}
              onClick={() => handleSliceCountChange(count)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                totalSlices === count
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-md shadow-rose-500/10 scale-105'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {count} Slices {count === 2 ? '(Halves)' : count === 4 ? '(Quarters)' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Educational Secret Panel */}
      <div className="bg-gradient-to-r from-rose-950/40 via-red-950/30 to-slate-900 border border-rose-800/40 p-4 rounded-2xl flex items-start gap-3">
        <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-slate-300 space-y-1">
          <div className="font-bold text-rose-300">Equivalent Fractions Magic:</div>
          <div>
            Did you know that <strong>2/4</strong> of a pizza is the exact same amount of food as <strong>1/2</strong> of a pizza?
            And <strong>4/8</strong> is also the same! When you multiply or divide the top and bottom by the same number, the fraction keeps the exact same size.
          </div>
        </div>
      </div>
    </div>
  );
}
