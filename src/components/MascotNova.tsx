import { useState } from 'react';
import { Sparkles, X, Lightbulb } from 'lucide-react';
import { sound } from '../utils/sound';

const NOVA_QUOTES = [
  { text: "Why can't you trust atoms? Because they make up everything! ⚛️", type: 'joke' },
  { text: "Did you know? If you could fold a piece of paper 42 times, it would reach the Moon! 🌕", type: 'fact' },
  { text: "Light travels so fast (300,000 km/s) it could circle the Earth 7.5 times in one second! ⚡", type: 'fact' },
  { text: "Why was the equal sign so humble? Because she knew she wasn't greater than or less than anyone else! ⚖️", type: 'joke' },
  { text: "Honeybees make hexagons because 6-sided shapes use the least wax to hold the most honey! 🐝", type: 'fact' },
  { text: "Never forget: On the Moon, you weigh 6 times less than on Earth! You'd be a super-jumper! 🚀", type: 'fact' },
  { text: "What did the triangle say to the circle? 'You're pointless!' 🔺", type: 'joke' },
  { text: "Energy cannot be destroyed—it only transforms from high potential to speedy kinetic! 🎢", type: 'fact' },
  { text: "You are doing amazing! Curiosity is the superpower that turns kids into scientists! 🌟", type: 'cheer' },
];

export function MascotNova() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const currentQuote = NOVA_QUOTES[quoteIndex];

  const handleNextQuote = () => {
    sound.play('pop');
    setIsAnimating(true);
    setQuoteIndex(prev => (prev + 1) % NOVA_QUOTES.length);
    setTimeout(() => setIsAnimating(false), 200);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end pointer-events-auto">
      {/* Speech Bubble */}
      {isOpen && (
        <div className="mb-2 max-w-xs bg-slate-900/95 border-2 border-amber-400/60 rounded-3xl p-4 shadow-2xl backdrop-blur-xl relative animate-bounce-slight">
          {/* Close button */}
          <button
            onClick={() => {
              setIsOpen(false);
              sound.play('click');
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-full flex items-center justify-center text-xs shadow-md"
            title="Dismiss speech bubble"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Type Badge */}
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-amber-400 mb-1">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>
              {currentQuote.type === 'joke' ? 'Nova\'s Science Chuckle' : currentQuote.type === 'fact' ? 'Cosmic Brain Fact' : 'Cheer Up!'}
            </span>
          </div>

          {/* Quote Content */}
          <p className={`text-xs text-white font-medium leading-relaxed transition-opacity ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            "{currentQuote.text}"
          </p>

          {/* Bubble Pointer Tail */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-slate-900 border-r-2 border-b-2 border-amber-400/60 transform rotate-45" />

          {/* Next Quote button */}
          <div className="mt-2.5 pt-2 border-t border-slate-800 flex justify-between items-center text-[10px]">
            <span className="text-slate-400">Nova the Space Bot</span>
            <button
              onClick={handleNextQuote}
              className="text-amber-400 font-extrabold hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Another Fact!</span>
            </button>
          </div>
        </div>
      )}

      {/* Mascot Character Button */}
      <button
        onClick={() => {
          if (!isOpen) {
            setIsOpen(true);
            sound.play('pop');
          } else {
            handleNextQuote();
          }
        }}
        className="group relative w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-0.5 shadow-2xl shadow-amber-500/30 transition-transform active:scale-90 hover:scale-105"
        title="Chat with Nova the Science Mascot!"
      >
        <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-3xl select-none group-hover:rotate-6 transition-transform">
          🤖
        </div>

        {/* Pulsing notification dot */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[9px] font-black text-slate-950 items-center justify-center">
            !
          </span>
        </span>
      </button>
    </div>
  );
}
