import { useState } from 'react';
import { QUEST_STEPS } from '../../data/wonderData';
import { useUser } from '../../context/UserContext';
import { sound } from '../../utils/sound';
import { fireBigCelebration, fireStarBurst } from '../../utils/confetti';
import { CheckCircle, ArrowRight, RotateCcw, Trophy, Award } from 'lucide-react';

export function CosmoQuest() {
  const { addXp, unlockBadge } = useUser();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const step = QUEST_STEPS[currentStepIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = step.options[idx].isCorrect;

    if (isCorrect) {
      sound.play('fanfare');
      fireStarBurst();
      addXp(step.xpReward, `Completed Quest Step ${step.id}!`);

      if (currentStepIndex === QUEST_STEPS.length - 1) {
        setIsCompleted(true);
        unlockBadge('badge_quest');
        fireBigCelebration();
      }
    } else {
      sound.play('gentleBoop');
    }
  };

  const handleNextStep = () => {
    sound.play('pop');
    setSelectedOption(null);
    setIsAnswered(false);
    if (currentStepIndex < QUEST_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    sound.play('click');
    setCurrentStepIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCompleted(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🧭</span>
            <h2 className="text-2xl font-bold text-white tracking-wide">Cosmo Quest: The Galactic Odyssey</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Embark on an epic 10-mission space expedition applying Math & Physics to save the star fleet!
          </p>
        </div>

        {/* Progress tracker */}
        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-300">
            Mission {currentStepIndex + 1} of {QUEST_STEPS.length}
          </span>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 transition-all duration-300 rounded-full"
          style={{ width: `${((currentStepIndex + (isAnswered ? 1 : 0)) / QUEST_STEPS.length) * 100}%` }}
        />
      </div>

      {isCompleted ? (
        /* Grand Victory Screen */
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-3xl border border-amber-500/40 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full flex items-center justify-center text-5xl shadow-2xl shadow-amber-400/30 animate-bounce-slight">
            🏆
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl font-black text-white tracking-wide">
              Galactic Graduation Achieved!
            </h3>
            <p className="text-slate-300 max-w-md mx-auto text-sm">
              You cracked every riddle across gravity, torque, fractions, optics, circuits, and geometry!
              The Star Fleet honors you as an official <strong>Grand Master of Math & Physics</strong>.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all active:scale-95 border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay Adventure</span>
            </button>
          </div>
        </div>
      ) : (
        /* Mission Scenario Card */
        <div className="space-y-6">
          {/* Story Prompt Box */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider">
              <span>{step.title}</span>
              <span className="bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                +{step.xpReward} XP REWARD
              </span>
            </div>

            <p className="text-slate-200 text-base leading-relaxed">
              {step.story}
            </p>

            <div className="pt-2 border-t border-slate-800 text-white font-bold text-base sm:text-lg">
              ❓ {step.question}
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3">
            {step.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let style = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900';

              if (isAnswered) {
                if (opt.isCorrect) {
                  style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/20';
                } else if (isSelected && !opt.isCorrect) {
                  style = 'bg-rose-950/60 border-rose-500 text-rose-200';
                } else {
                  style = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border text-left font-bold text-sm sm:text-base transition-all duration-200 flex items-start justify-between gap-3 ${style}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-300 shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt.label}</span>
                  </div>

                  {isAnswered && opt.isCorrect && (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Mascot Reaction */}
          {isAnswered && (
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 animate-bounce-slight">
              <div className="flex items-center gap-2 text-sm font-black text-amber-400">
                <Award className="w-4 h-4" />
                <span>{step.options[selectedOption!].isCorrect ? 'Correct Analysis!' : 'Learning Moment:'}</span>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {step.explanation}
              </p>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 text-xs text-amber-200 font-medium">
                {step.mascotReaction}
              </div>

              {/* Next Step Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm transition-all active:scale-95 shadow-xl shadow-orange-500/20"
                >
                  <span>{currentStepIndex === QUEST_STEPS.length - 1 ? 'Claim Victory Badge!' : 'Proceed to Next Mission'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
