import { useState } from 'react';
import { Sparkles, Box, Shapes, RotateCw } from 'lucide-react';
import { sound } from '../../utils/sound';
import { fireCelebration } from '../../utils/confetti';
import { useUser } from '../../context/UserContext';

const POLYGON_NAMES: Record<number, { name: string; funFact: string }> = {
  3: { name: 'Equilateral Triangle', funFact: 'The strongest natural shape! Bridges and trusses are built from triangles.' },
  4: { name: 'Square / Quadrilateral', funFact: 'All 4 interior angles are exactly 90 degrees right angles (sum = 360°).' },
  5: { name: 'Regular Pentagon', funFact: 'A 5-pointed star can be drawn inside every regular pentagon!' },
  6: { name: 'Regular Hexagon', funFact: 'Honeybees use hexagons because they tile together with zero wasted space!' },
  7: { name: 'Regular Heptagon', funFact: 'Used in British 20p and 50p coins to roll through vending machines.' },
  8: { name: 'Regular Octagon', funFact: 'The classic shape of Stop Signs around the world!' },
  10: { name: 'Regular Decagon', funFact: 'Has 10 equal sides and 10 vertices!' },
  12: { name: 'Regular Dodecagon', funFact: 'Can tile seamlessly with equilateral triangles and squares!' },
};

export function GeometryTransformer() {
  const { addXp, unlockBadge, completeLab } = useUser();

  const [sides, setSides] = useState<number>(5);
  const [radius, setRadius] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'2d' | '3d_net'>('2d');
  const [unfoldPercent, setUnfoldPercent] = useState<number>(40);

  // Polygon calculations
  const info = POLYGON_NAMES[sides] || { name: `${sides}-gon`, funFact: 'As sides approach infinity, it becomes a circle!' };
  const interiorSum = (sides - 2) * 180;
  const singleAngle = (interiorSum / sides).toFixed(1);
  const sideLength = (2 * radius * Math.sin(Math.PI / sides)).toFixed(1);
  const perimeter = (parseFloat(sideLength) * sides).toFixed(1);
  const area = ((0.5 * sides * Math.pow(radius, 2) * Math.sin((2 * Math.PI) / sides)) / 100).toFixed(1);

  // Generate SVG Polygon Points
  const center = 160;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2 + (rotation * Math.PI) / 180;
    points.push({
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    });
  }
  const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');

  const handleSidesChange = (newSides: number) => {
    setSides(newSides);
    sound.play('pop');
    if (newSides === 8) {
      sound.play('fanfare');
      fireCelebration();
      unlockBadge('badge_geometry');
      completeLab('geometry');
      addXp(30, 'Discovered the Octagon and angle geometry secrets!');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">💎</span>
            <h2 className="text-2xl font-bold text-white tracking-wide">Shape Morphing Transformer</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Slide to transform shapes! Watch vertices, angles, perimeter, and 3D geometric nets unfold.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 gap-1.5">
          <button
            onClick={() => {
              setViewMode('2d');
              sound.play('click');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === '2d'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shapes className="w-3.5 h-3.5" />
            <span>2D Polygons</span>
          </button>
          <button
            onClick={() => {
              setViewMode('3d_net');
              sound.play('pop');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === '3d_net'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Cube Net</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      {viewMode === '2d' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Shape Display SVG */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center relative min-h-[360px] overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:24px_24px]" />

            <svg className="w-full max-w-[320px] aspect-square" viewBox="0 0 320 320">
              {/* Circumcircle guide */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Polygon Shape */}
              <polygon
                points={pointsStr}
                fill="rgba(99, 102, 241, 0.25)"
                stroke="#818cf8"
                strokeWidth="4"
                strokeLinejoin="round"
                className="filter drop-shadow-[0_0_12px_rgba(99,102,241,0.5)] transition-all duration-300"
              />

              {/* Triangle Radius Spoke Lines */}
              {points.map((p, idx) => (
                <line
                  key={idx}
                  x1={center}
                  y1={center}
                  x2={p.x}
                  y2={p.y}
                  stroke="#6366f140"
                  strokeWidth="1.5"
                />
              ))}

              {/* Vertices Points */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle cx={p.x} cy={p.y} r="6" fill="#f8fafc" stroke="#4f46e5" strokeWidth="2.5" />
                  <text
                    x={p.x + (p.x > center ? 10 : -10)}
                    y={p.y + (p.y > center ? 12 : -8)}
                    fill="#a5b4fc"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="Fredoka"
                  >
                    V{idx + 1}
                  </text>
                </g>
              ))}

              {/* Center point */}
              <circle cx={center} cy={center} r="4" fill="#818cf8" />
            </svg>

            {/* Shape Name Badge */}
            <div className="mt-2 bg-indigo-950/80 border border-indigo-700/50 px-4 py-1.5 rounded-full text-indigo-300 font-bold text-sm">
              {info.name} ({sides} Equal Sides)
            </div>
          </div>

          {/* Mathematical Properties Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                GEOMETRY PROPERTIES
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">VERTICES (CORNERS)</span>
                  <span className="text-white font-bold text-base">{sides} Vertices</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">EACH INTERIOR ANGLE</span>
                  <span className="text-amber-400 font-bold text-base">{singleAngle}°</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">SUM OF ALL ANGLES</span>
                  <span className="text-cyan-400 font-bold text-base">{interiorSum}°</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">PERIMETER (BORDER)</span>
                  <span className="text-emerald-400 font-bold text-base">{perimeter} px</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 col-span-2">
                  <span className="text-slate-400 block text-[10px]">INTERIOR AREA (SPACE)</span>
                  <span className="text-rose-400 font-bold text-base">{area} k-px²</span>
                </div>
              </div>

              {/* Angle Formula callout */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div className="font-bold text-slate-200">Angle Formula:</div>
                <div className="font-mono text-indigo-300">Sum = (Sides - 2) × 180°</div>
                <div className="text-slate-400">({sides} - 2) × 180° = {interiorSum}°</div>
              </div>
            </div>

            {/* Quick Fun Fact */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-amber-400">💡 Secret Fact: </span>
              {info.funFact}
            </div>
          </div>
        </div>
      ) : (
        /* 3D Cube Net Unfolding View */
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-8 flex flex-col items-center justify-center space-y-6 min-h-[360px]">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-white">3D Cube Net Unfolder</h3>
            <p className="text-slate-400 text-xs">
              Every 3D cube is made of 6 square faces! Unfold it into a 2D cross pattern.
            </p>
          </div>

          {/* Unfolding SVG Net */}
          <div className="w-full max-w-[340px] aspect-square flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 300 300">
              {/* Center Square (Base) */}
              <rect x="110" y="110" width="80" height="80" rx="4" fill="#6366f1" stroke="#a5b4fc" strokeWidth="2" />
              <text x="150" y="155" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">BASE</text>

              {/* Top Flap */}
              <rect
                x="110"
                y={110 - (80 * unfoldPercent) / 100}
                width="80"
                height={(80 * unfoldPercent) / 100}
                rx="4"
                fill="#818cf8"
                stroke="#c7d2fe"
                strokeWidth="2"
              />

              {/* Bottom Flap */}
              <rect
                x="110"
                y="190"
                width="80"
                height={(80 * unfoldPercent) / 100}
                rx="4"
                fill="#818cf8"
                stroke="#c7d2fe"
                strokeWidth="2"
              />

              {/* Left Flap */}
              <rect
                x={110 - (80 * unfoldPercent) / 100}
                y="110"
                width={(80 * unfoldPercent) / 100}
                height="80"
                rx="4"
                fill="#4f46e5"
                stroke="#a5b4fc"
                strokeWidth="2"
              />

              {/* Right Flap */}
              <rect
                x="190"
                y="110"
                width={(80 * unfoldPercent) / 100}
                height="80"
                rx="4"
                fill="#4f46e5"
                stroke="#a5b4fc"
                strokeWidth="2"
              />

              {/* Far Top Flap (Lid) */}
              <rect
                x="110"
                y={110 - (160 * unfoldPercent) / 100}
                width="80"
                height={(80 * unfoldPercent) / 100}
                rx="4"
                fill="#a855f7"
                stroke="#e9d5ff"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Unfold Slider */}
          <div className="w-full max-w-md space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Folded 3D Cube</span>
              <span className="text-purple-400 font-mono">{unfoldPercent}% Flat Net</span>
              <span>Flat 2D Net</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={unfoldPercent}
              onChange={(e) => {
                setUnfoldPercent(Number(e.target.value));
                sound.play('click');
              }}
              className="w-full accent-purple-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Polygon Sides Slider Controls */}
      {viewMode === '2d' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
          {/* Sides Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-300">Number of Sides</span>
              <span className="text-indigo-400 font-bold bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-800 text-xs">
                {sides} Sides
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="12"
              value={sides}
              onChange={(e) => handleSidesChange(Number(e.target.value))}
              className="w-full accent-indigo-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>3 (Triangle)</span>
              <span>6 (Hexagon)</span>
              <span>12 (Dodecagon)</span>
            </div>
          </div>

          {/* Size / Radius Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-300">Shape Radius</span>
              <span className="text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800 text-xs">
                {radius} px
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="140"
              value={radius}
              onChange={(e) => {
                setRadius(Number(e.target.value));
                sound.play('click');
              }}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Rotation Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="flex items-center gap-1.5 text-slate-300">
                <RotateCw className="w-4 h-4 text-purple-400" /> Spin Rotation
              </span>
              <span className="text-purple-400 font-bold bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-800 text-xs">
                {rotation}°
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Secret panel */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-800/40 p-4 rounded-2xl flex items-start gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-slate-300 space-y-1">
          <div className="font-bold text-indigo-300">The Secret of Polygons to Circles:</div>
          <div>
            Notice what happens as you increase the number of sides from 3 to 12 and beyond:
            The edges get shorter, the corners flatten out, and the shape gradually transforms into a smooth <strong>Circle</strong>!
            Mathematicians discovered that a circle is simply a polygon with infinite sides!
          </div>
        </div>
      </div>
    </div>
  );
}
