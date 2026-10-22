import { useState, useEffect, useRef } from 'react';
import { Timer, Zap, Trophy, Flame, Play, RotateCcw } from 'lucide-react';
import { sound } from '../../utils/sound';
import { fireCelebration, fireStarBurst } from '../../utils/confetti';
import { useUser } from '../../context/UserContext';

type Difficulty = 'cadet' | 'astronaut' | 'master';
type Operation = 'add' | 'sub' | 'mul' | 'mixed';

interface Question {
  text: string;
  answer: number;
  choices: number[];
}

export function MathArcade() {
  const { addXp, unlockBadge, completeLab } = useUser();

  const [difficulty, setDifficulty] = useState<Difficulty>('astronaut');
  const [operation, setOperation] = useState<Operation>('mixed');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateQuestion = (diff: Difficulty, op: Operation): Question => {
    let chosenOp = op;
    if (op === 'mixed') {
      const ops: Operation[] = ['add', 'sub', 'mul'];
      chosenOp = ops[Math.floor(Math.random() * ops.length)];
    }

    let a = 1;
    let b = 1;
    let text = '';
    let answer = 0;

    if (diff === 'cadet') {
      if (chosenOp === 'add') {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        answer = a + b;
        text = `${a} + ${b} = ?`;
      } else if (chosenOp === 'sub') {
        b = Math.floor(Math.random() * 8) + 1;
        a = b + Math.floor(Math.random() * 10);
        answer = a - b;
        text = `${a} - ${b} = ?`;
      } else {
        a = Math.floor(Math.random() * 5) + 1;
        b = Math.floor(Math.random() * 5) + 1;
        answer = a * b;
        text = `${a} × ${b} = ?`;
      }
    } else if (diff === 'astronaut') {
      if (chosenOp === 'add') {
        a = Math.floor(Math.random() * 40) + 10;
        b = Math.floor(Math.random() * 40) + 10;
        answer = a + b;
        text = `${a} + ${b} = ?`;
      } else if (chosenOp === 'sub') {
        b = Math.floor(Math.random() * 30) + 10;
        a = b + Math.floor(Math.random() * 40);
        answer = a - b;
        text = `${a} - ${b} = ?`;
      } else {
        a = Math.floor(Math.random() * 9) + 2;
        b = Math.floor(Math.random() * 9) + 2;
        answer = a * b;
        text = `${a} × ${b} = ?`;
      }
    } else {
      // Master
      if (chosenOp === 'add') {
        a = Math.floor(Math.random() * 90) + 30;
        b = Math.floor(Math.random() * 90) + 30;
        answer = a + b;
        text = `${a} + ${b} = ?`;
      } else if (chosenOp === 'sub') {
        b = Math.floor(Math.random() * 60) + 20;
        a = b + Math.floor(Math.random() * 80);
        answer = a - b;
        text = `${a} - ${b} = ?`;
      } else {
        a = Math.floor(Math.random() * 12) + 3;
        b = Math.floor(Math.random() * 12) + 3;
        answer = a * b;
        text = `${a} × ${b} = ?`;
      }
    }

    // Generate 3 unique wrong answers
    const choices = [answer];
    while (choices.length < 4) {
      const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 6) + 1);
      const wrong = Math.max(0, answer + offset);
      if (!choices.includes(wrong)) {
        choices.push(wrong);
      }
    }

    // Shuffle choices
    return {
      text,
      answer,
      choices: choices.sort(() => Math.random() - 0.5)
    };
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(60);
    setSelectedChoice(null);
    setIsAnswerCorrect(null);
    setCurrentQ(generateQuestion(difficulty, operation));
    sound.play('launch');

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    sound.play('fanfare');
    fireCelebration();
    addXp(Math.max(20, Math.floor(score * 0.5)), 'Finished Speed Math Arcade round!');
    completeLab('arcade');
  };

  const handleChoice = (choice: number) => {
    if (!currentQ || selectedChoice !== null) return;

    setSelectedChoice(choice);
    const correct = choice === currentQ.answer;
    setIsAnswerCorrect(correct);

    if (correct) {
      sound.play('chime');
      const newStreak = streak + 1;
      const multiplier = newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1;
      const pointsAdded = 10 * multiplier;

      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setScore(prev => prev + pointsAdded);

      if (newStreak === 10) {
        sound.play('fanfare');
        fireStarBurst();
        unlockBadge('badge_arcade');
      }

      setTimeout(() => {
        setSelectedChoice(null);
        setIsAnswerCorrect(null);
        setCurrentQ(generateQuestion(difficulty, operation));
      }, 350);
    } else {
      sound.play('gentleBoop');
      setStreak(0);
      setTimeout(() => {
        setSelectedChoice(null);
        setIsAnswerCorrect(null);
        setCurrentQ(generateQuestion(difficulty, operation));
      }, 700);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">⭐</span>
            <h2 className="text-2xl font-bold text-white tracking-wide">Speed Math Space Arcade</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Boost your mental calculation power! Build combo streaks and beat the 60-second timer.
          </p>
        </div>

        {/* Difficulty Chooser */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 gap-1.5">
          {(['cadet', 'astronaut', 'master'] as Difficulty[]).map(d => (
            <button
              key={d}
              onClick={() => {
                setDifficulty(d);
                sound.play('click');
                if (isPlaying) {
                  setCurrentQ(generateQuestion(d, operation));
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                difficulty === d
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {d === 'cadet' ? '🌱 Cadet (5-7)' : d === 'astronaut' ? '🚀 Astro (8-10)' : '⚡ Master (11+)'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Arcade Board */}
      <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-8 min-h-[380px] flex flex-col items-center justify-center overflow-hidden">
        {/* Subtle arcade grid */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />

        {isPlaying && currentQ ? (
          <div className="relative z-10 w-full max-w-md flex flex-col items-center space-y-6">
            {/* Live HUD Header */}
            <div className="w-full flex justify-between items-center bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-2xl backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-sm">
                <Timer className="w-4 h-4" />
                <span>{timeLeft}s</span>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-slate-300">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Score: <strong className="text-white text-base font-black">{score}</strong></span>
              </div>

              <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 text-xs font-black text-amber-300">
                <Flame className="w-4 h-4 text-orange-400 animate-bounce-slight" />
                <span>{streak}x STREAK</span>
              </div>
            </div>

            {/* Question Display Card */}
            <div className="w-full bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 p-8 rounded-3xl text-center shadow-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                CALCULATE QUICKLY:
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-wide mt-2 filter drop-shadow">
                {currentQ.text}
              </div>
            </div>

            {/* 4 Multi-Choice Option Buttons */}
            <div className="grid grid-cols-2 gap-4 w-full">
              {currentQ.choices.map((choice, idx) => {
                const isSelected = selectedChoice === choice;
                let btnStyle = 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800';

                if (isSelected) {
                  btnStyle = isAnswerCorrect
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 scale-105 shadow-lg shadow-emerald-500/30'
                    : 'bg-rose-500 text-white border-rose-400 animate-pulse';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleChoice(choice)}
                    className={`py-4 px-6 rounded-2xl font-black text-2xl border transition-all active:scale-95 shadow-lg ${btnStyle}`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Start Screen */
          <div className="relative z-10 flex flex-col items-center text-center space-y-4 max-w-sm">
            <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-center justify-center text-4xl shadow-xl">
              ⚡
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Ready for the 60s Speed Rush?</h3>
              <p className="text-slate-400 text-xs mt-1">
                Answer as many math challenges as you can! Earn bonus combo multipliers for consecutive right answers.
              </p>
            </div>

            {score > 0 && (
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl w-full flex justify-around text-xs">
                <div>
                  <span className="text-slate-400 block">FINAL SCORE</span>
                  <span className="text-amber-400 font-extrabold text-base">{score} pts</span>
                </div>
                <div>
                  <span className="text-slate-400 block">MAX STREAK</span>
                  <span className="text-orange-400 font-extrabold text-base">{maxStreak}x combo</span>
                </div>
              </div>
            )}

            <button
              onClick={startGame}
              className="w-full py-3.5 px-6 rounded-2xl font-black text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 transition-all active:scale-95 shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 text-base"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{score > 0 ? 'Play Again!' : 'Start 60s Challenge!'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Operation Filter bar */}
      <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
          Operation Focus:
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'mixed', label: '🔀 Mixed Operations' },
            { id: 'add', label: '➕ Addition Only' },
            { id: 'sub', label: '➖ Subtraction Only' },
            { id: 'mul', label: '✖️ Multiplication Only' },
          ].map(op => (
            <button
              key={op.id}
              onClick={() => {
                setOperation(op.id as Operation);
                sound.play('click');
                if (isPlaying) {
                  setCurrentQ(generateQuestion(difficulty, op.id as Operation));
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                operation === op.id
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>

        {isPlaying && (
          <button
            onClick={endGame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Quit Round</span>
          </button>
        )}
      </div>

      {/* Educational Secret Panel */}
      <div className="bg-gradient-to-r from-yellow-950/40 via-amber-950/30 to-slate-900 border border-yellow-800/40 p-4 rounded-2xl flex items-start gap-3">
        <div className="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-yellow-400">
          <Zap className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-slate-300 space-y-1">
          <div className="font-bold text-yellow-300">The Power of Mental Math Patterns:</div>
          <div>
            Fast math isn't memorization—it's using clever shortcuts!
            For instance, multiplying by 5 is just cutting in half and adding a zero (e.g., $14 \times 5 = 7 \times 10 = 70$)!
            Adding 9 is just adding 10 and taking away 1!
          </div>
        </div>
      </div>
    </div>
  );
}
