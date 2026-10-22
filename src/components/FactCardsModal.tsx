import { useState } from 'react';
import { X, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { FACT_CARDS } from '../data/wonderData';
import { sound } from '../utils/sound';

interface FactCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchLab: (labId: string) => void;
}

export function FactCardsModal({ isOpen, onClose }: FactCardsModalProps) {
  const [selectedFactId, setSelectedFactId] = useState<string>(FACT_CARDS[0].id);

  if (!isOpen) return null;

  const activeFact = FACT_CARDS.find(f => f.id === selectedFactId) || FACT_CARDS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <div>
              <h3 className="text-xl font-bold text-white">Why & How? Science & Math Cards</h3>
              <p className="text-xs text-slate-400">
                Explore bite-sized answers to the universe's most curious questions!
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

        {/* Fact Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FACT_CARDS.map(card => (
            <button
              key={card.id}
              onClick={() => {
                setSelectedFactId(card.id);
                sound.play('pop');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedFactId === card.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10 scale-105'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{card.emoji}</span>
              <span>{card.title}</span>
            </button>
          ))}
        </div>

        {/* Selected Card Deep Dive */}
        <div className="bg-gradient-to-b from-slate-950 to-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-md border border-cyan-800">
                {activeFact.category.toUpperCase()} MYSTERY
              </span>
              <h4 className="text-2xl font-black text-white font-heading">
                {activeFact.question}
              </h4>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-4xl shadow-md shrink-0">
              {activeFact.emoji}
            </div>
          </div>

          {/* Simple Explanation */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-slate-200 text-sm sm:text-base leading-relaxed">
            <span className="font-bold text-cyan-300 block mb-1">Simple Explanation:</span>
            {activeFact.shortAnswer}
          </div>

          {/* Mind-Blowing Fun Fact */}
          <div className="bg-amber-950/30 border border-amber-500/30 p-4 rounded-xl text-amber-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-amber-300 block mb-0.5">Mind-Blowing Secret:</span>
              {activeFact.funFact}
            </div>
          </div>

          {/* Interactive Playground Link */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="text-slate-400">
              <span className="font-bold text-white">Try it yourself: </span>
              {activeFact.interactiveTip}
            </div>
            <button
              onClick={() => {
                onClose();
                sound.play('click');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-black transition-all active:scale-95 ml-auto"
            >
              <span>Explore in Labs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
