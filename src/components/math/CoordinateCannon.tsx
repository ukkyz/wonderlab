import { useState } from 'react';
import { Target, Sparkles, RotateCcw, Crosshair } from 'lucide-react';
import { sound } from '../../utils/sound';
import { fireCelebration } from '../../utils/confetti';
import { useUser } from '../../context/UserContext';

interface TargetGem {
  id: number;
  x: number;
  y: number;
  emoji: string;
  name: string;
  collected: boolean;
}

const INITIAL_TARGETS: TargetGem[] = [
  { id: 1, x: 3, y: 4, emoji: '💎', name: 'Blue Crystal', collected: false },
  { id: 2, x: -2, y: 3, emoji: '⭐', name: 'Golden Star', collected: false },
  { id: 3, x: 5, y: 2, emoji: '🪐', name: 'Cosmic Orb', collected: false },
  { id: 4, x: -4, y: 5, emoji: '🛸', name: 'Space Probe', collected: false },
];

export function CoordinateCannon() {
  const { addXp, unlockBadge, completeLab } = useUser();

  const [targets, setTargets] = useState<TargetGem[]>(INITIAL_TARGETS);
  const [targetIdx, setTargetIdx] = useState<number>(0);
  const [dialX, setDialX] = useState<number>(0);
  const [dialY, setDialY] = useState<number>(2);
  const [laserShot, setLaserShot] = useState<{ x: number; y: number } | null>(null);
  const [hitMessage, setHitMessage] = useState<string | null>(null);

  const currentObjective = targets[targetIdx] || targets[0];

  const fireAtCoordinate = () => {
    sound.play('laser');
    setLaserShot({ x: dialX, y: dialY });

    // Check hit
    const hit = targets.find(t => !t.collected && t.x === dialX && t.y === dialY);

    if (hit) {
      sound.play('fanfare');
      fireCelebration();
      setTargets(prev => prev.map(t => t.id === hit.id ? { ...t, collected: true } : t));
      setHitMessage(`🎯 Direct Hit! Coordinate (${dialX}, ${dialY}) vaporized the ${hit.name}!`);
      addXp(35, `Hit coordinate (${dialX}, ${dialY}) precision target!`);
      unlockBadge('badge_cannon');
      completeLab('cannon');

      // Next uncollected target
      setTimeout(() => {
        const remaining = targets.findIndex(t => !t.collected && t.id !== hit.id);
        if (remaining !== -1) {
          setTargetIdx(remaining);
        }
      }, 1500);
    } else {
      sound.play('gentleBoop');
      setHitMessage(`Missed! Beam fired to (${dialX}, ${dialY}). Objective is at (${currentObjective.x}, ${currentObjective.y}).`);
    }

    setTimeout(() => {
      setLaserShot(null);
    }, 1200);
  };

  const handleReset = () => {
    sound.play('click');
    setTargets(INITIAL_TARGETS);
    setTargetIdx(0);
    setHitMessage(null);
    setDialX(0);
    setDialY(2);
  };

  // Grid coordinates map to SVG coordinates
  // Grid: X from -5 to +5 (center = 0)
  // Grid: Y from 0 to 6 (bottom = 0, top = 6)
  const svgWidth = 500;
  const svgHeight = 320;
  const paddingX = 40;
  const paddingY = 30;

  const toSvgX = (gx: number) => {
    const usableW = svgWidth - 2 * paddingX;
    return paddingX + ((gx + 5) / 10) * usableW;
  };

  const toSvgY = (gy: number) => {
    const usableH = svgHeight - 2 * paddingY;
    return svgHeight - paddingY - (gy / 6) * usableH;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            <h2 className="text-2xl font-bold text-white tracking-wide">Cosmo Coordinate Cannon</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Master the Cartesian 2D grid! Dial (X, Y) coordinates to aim the laser cannon.
          </p>
        </div>

        {/* Current Target Card */}
        <div className="bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 px-4 py-2 rounded-2xl flex items-center gap-3 backdrop-blur-md">
          <span className="text-2xl">{currentObjective.emoji}</span>
          <div>
            <div className="text-[10px] text-cyan-300 font-bold uppercase">TARGET MISSION</div>
            <div className="text-sm font-extrabold text-white">
              {currentObjective.name} at{' '}
              <span className="text-amber-400 font-mono">
                ({currentObjective.x}, {currentObjective.y})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Coordinate Grid Display */}
      <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[360px] overflow-hidden">
        <svg className="w-full max-w-[560px] aspect-[5/3]" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          {/* Subtle grid lines */}
          {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map(x => (
            <line
              key={`gx-${x}`}
              x1={toSvgX(x)}
              y1={paddingY}
              x2={toSvgX(x)}
              y2={svgHeight - paddingY}
              stroke={x === 0 ? '#38bdf8' : '#1e293b'}
              strokeWidth={x === 0 ? 2 : 1}
            />
          ))}

          {[0, 1, 2, 3, 4, 5, 6].map(y => (
            <line
              key={`gy-${y}`}
              x1={paddingX}
              y1={toSvgY(y)}
              x2={svgWidth - paddingX}
              y2={toSvgY(y)}
              stroke={y === 0 ? '#38bdf8' : '#1e293b'}
              strokeWidth={y === 0 ? 2 : 1}
            />
          ))}

          {/* Grid Numbers Labels */}
          {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map(x => (
            <text
              key={`tx-${x}`}
              x={toSvgX(x)}
              y={toSvgY(0) + 16}
              textAnchor="middle"
              fill="#64748b"
              fontSize="10"
              fontWeight="bold"
            >
              {x}
            </text>
          ))}

          {[1, 2, 3, 4, 5, 6].map(y => (
            <text
              key={`ty-${y}`}
              x={toSvgX(0) - 10}
              y={toSvgY(y) + 3}
              textAnchor="end"
              fill="#64748b"
              fontSize="10"
              fontWeight="bold"
            >
              {y}
            </text>
          ))}

          {/* Cannon base at (0, 0) */}
          <g transform={`translate(${toSvgX(0)}, ${toSvgY(0)})`}>
            <circle cx="0" cy="0" r="14" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="0" cy="0" r="5" fill="#f8fafc" />
            <text x="0" y="24" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
              ORIGIN (0, 0)
            </text>
          </g>

          {/* Aim Reticle at (dialX, dialY) */}
          <g transform={`translate(${toSvgX(dialX)}, ${toSvgY(dialY)})`}>
            <circle cx="0" cy="0" r="16" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="-20" y1="0" x2="20" y2="0" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="0" y1="-20" x2="0" y2="20" stroke="#f59e0b" strokeWidth="1.5" />
          </g>

          {/* Laser beam when fired */}
          {laserShot && (
            <line
              x1={toSvgX(0)}
              y1={toSvgY(0)}
              x2={toSvgX(laserShot.x)}
              y2={toSvgY(laserShot.y)}
              stroke="#f43f5e"
              strokeWidth="4"
              strokeLinecap="round"
              className="filter drop-shadow-[0_0_12px_rgba(244,63,94,1)] animate-pulse"
            />
          )}

          {/* Floating Target Gems */}
          {targets.map(target => {
            if (target.collected) return null;
            const isCurrent = target.id === currentObjective.id;

            return (
              <g
                key={target.id}
                transform={`translate(${toSvgX(target.x)}, ${toSvgY(target.y)})`}
                onClick={() => {
                  setDialX(target.x);
                  setDialY(target.y);
                  sound.play('click');
                }}
                className="cursor-pointer group"
              >
                {/* Target Pulsing Halo */}
                {isCurrent && (
                  <circle
                    cx="0"
                    cy="0"
                    r="20"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2"
                    className="animate-ping opacity-60"
                  />
                )}
                <circle cx="0" cy="0" r="14" fill="#0f172a" stroke={isCurrent ? '#38bdf8' : '#475569'} strokeWidth="1.5" />
                <text x="0" y="5" textAnchor="middle" fontSize="16" className="select-none">
                  {target.emoji}
                </text>
                {/* Coordinate badge hover */}
                <rect x="-24" y="-28" width="48" height="15" rx="3" fill="#0f172a" stroke="#334155" />
                <text x="0" y="-17" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
                  ({target.x}, {target.y})
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hit/Miss Alert Banner */}
        {hitMessage && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-cyan-500/50 px-5 py-2 rounded-full text-xs font-bold text-white shadow-xl animate-bounce-slight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{hitMessage}</span>
          </div>
        )}
      </div>

      {/* Coordinate Dial Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
        {/* Dial X Coordinate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-slate-300">X Coordinate (Horizontal)</span>
            <span className="text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800 text-xs">
              X = {dialX > 0 ? `+${dialX}` : dialX}
            </span>
          </div>
          <input
            type="range"
            min="-5"
            max="5"
            value={dialX}
            onChange={(e) => {
              setDialX(Number(e.target.value));
              sound.play('click');
            }}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>-5 (Left)</span>
            <span>0 (Center)</span>
            <span>+5 (Right)</span>
          </div>
        </div>

        {/* Dial Y Coordinate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-slate-300">Y Coordinate (Vertical)</span>
            <span className="text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-800 text-xs">
              Y = {dialY}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="6"
            value={dialY}
            onChange={(e) => {
              setDialY(Number(e.target.value));
              sound.play('click');
            }}
            className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>0 (Ground)</span>
            <span>3 (Mid-Air)</span>
            <span>6 (Sky High)</span>
          </div>
        </div>

        {/* Fire Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={fireAtCoordinate}
            className="flex-1 py-3 px-4 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all active:scale-95 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            <Crosshair className="w-5 h-5" />
            <span>Fire at ({dialX}, {dialY})!</span>
          </button>
          <button
            onClick={handleReset}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 transition-all active:scale-95"
            title="Reset Targets"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Educational Secret Panel */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-900 border border-cyan-800/40 p-4 rounded-2xl flex items-start gap-3">
        <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
          <Target className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-slate-300 space-y-1">
          <div className="font-bold text-cyan-300">How René Descartes Invented Coordinates:</div>
          <div>
            Legend says philosopher René Descartes was lying in bed watching a fly crawl across his tiled ceiling.
            He realized he could pinpoint the fly's exact location simply by counting how many tiles it was from the corner (X) and from the wall (Y)!
            Always remember: <strong>Walk across the hall (X) before taking the elevator (Y)</strong>!
          </div>
        </div>
      </div>
    </div>
  );
}
