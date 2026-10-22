import { useState, useEffect } from 'react';
import { Zap, Power, Lightbulb, Fan, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../../utils/sound';
import { fireCelebration } from '../../utils/confetti';
import { useUser } from '../../context/UserContext';

export function CircuitLab() {
  const { addXp, unlockBadge, completeLab } = useUser();

  const [switchClosed, setSwitchClosed] = useState<boolean>(false);
  const [batteryVoltage, setBatteryVoltage] = useState<number>(3); // 1.5V, 3.0V, 9.0V
  const [loadType, setLoadType] = useState<'bulb' | 'fan'>('bulb');
  const [resistorValue, setResistorValue] = useState<number>(10); // Ohms
  const [electronOffset, setElectronOffset] = useState<number>(0);

  // Ohm's law calculation: I = V / R
  const current = switchClosed ? parseFloat((batteryVoltage / resistorValue).toFixed(2)) : 0;
  const isGlowing = switchClosed && current > 0.05;

  // Animate moving electron particles along circuit wire
  useEffect(() => {
    if (!switchClosed) return;
    const interval = setInterval(() => {
      setElectronOffset(prev => (prev + 1) % 40);
    }, 40);
    return () => clearInterval(interval);
  }, [switchClosed]);

  const toggleSwitch = () => {
    const nextState = !switchClosed;
    setSwitchClosed(nextState);
    if (nextState) {
      sound.play('zap');
      fireCelebration();
      unlockBadge('badge_circuits');
      completeLab('circuit');
      addXp(30, 'Closed the loop and powered up the electric circuit!');
    } else {
      sound.play('click');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">⚡</span>
            <h2 className="text-2xl font-bold text-white tracking-wide">Electric Spark Sandbox</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Build a closed loop circuit! Flip the switch and watch electrons race through the wires.
          </p>
        </div>

        {/* Load Switcher */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 gap-1.5">
          <button
            onClick={() => {
              setLoadType('bulb');
              sound.play('pop');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              loadType === 'bulb'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Lightbulb</span>
          </button>
          <button
            onClick={() => {
              setLoadType('fan');
              sound.play('pop');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              loadType === 'fan'
                ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Fan className="w-3.5 h-3.5" />
            <span>Motor Fan</span>
          </button>
        </div>
      </div>

      {/* Circuit Board Canvas / Interactive Diagram */}
      <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-8 min-h-[380px] flex items-center justify-center overflow-hidden">
        {/* Subtle schematic grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Multimeter Overlay in Corner */}
        <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-800 rounded-xl p-3 backdrop-blur-md space-y-1 shadow-lg">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> Digital Multimeter
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
            <div>
              <div className="text-slate-400 text-[10px]">VOLTAGE (V)</div>
              <div className="text-amber-400 font-mono font-bold text-sm">{batteryVoltage} V</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">CURRENT (I)</div>
              <div className="text-cyan-400 font-mono font-bold text-sm">{current} A</div>
            </div>
          </div>
        </div>

        {/* SVG Circuit Schematic */}
        <div className="relative w-full max-w-[540px] aspect-[5/3]">
          <svg className="w-full h-full" viewBox="0 0 500 300">
            {/* Base Wire Loop */}
            <path
              d="M 100 80 L 400 80 L 400 220 L 100 220 Z"
              fill="none"
              stroke="#334155"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Live Wire Glow when closed */}
            {switchClosed && (
              <path
                d="M 100 80 L 400 80 L 400 220 L 100 220 Z"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeDasharray="8 12"
                strokeDashoffset={-electronOffset}
                strokeLinecap="round"
                className="filter drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"
              />
            )}

            {/* TOP COMPONENT: Switch (clickable) */}
            <g
              className="cursor-pointer group"
              onClick={toggleSwitch}
              transform="translate(250, 80)"
            >
              {/* Gap base */}
              <circle cx="-25" cy="0" r="6" fill="#64748b" stroke="#f8fafc" strokeWidth="2" />
              <circle cx="25" cy="0" r="6" fill="#64748b" stroke="#f8fafc" strokeWidth="2" />

              {/* Lever arm */}
              <line
                x1="-25"
                y1="0"
                x2={switchClosed ? "25" : "15"}
                y2={switchClosed ? "0" : "-30"}
                stroke={switchClosed ? "#10b981" : "#f43f5e"}
                strokeWidth="5"
                strokeLinecap="round"
                className="transition-all duration-200"
              />

              {/* Interactive toggle pill */}
              <rect
                x="-40"
                y="-45"
                width="80"
                height="22"
                rx="11"
                fill="#0f172a"
                stroke={switchClosed ? "#10b981" : "#f43f5e"}
                strokeWidth="1.5"
              />
              <text
                x="0"
                y="-30"
                textAnchor="middle"
                fill={switchClosed ? "#34d399" : "#fb7185"}
                fontSize="10"
                fontWeight="bold"
                fontFamily="Fredoka"
              >
                {switchClosed ? 'SWITCH CLOSED (ON)' : 'CLICK TO CLOSE (OFF)'}
              </text>
            </g>

            {/* LEFT COMPONENT: Battery */}
            <g transform="translate(100, 150)">
              {/* Battery body */}
              <rect x="-18" y="-30" width="36" height="60" rx="6" fill="#1e293b" stroke="#e2e8f0" strokeWidth="2" />
              {/* Battery terminal pip */}
              <rect x="-6" y="-36" width="12" height="6" rx="2" fill="#e2e8f0" />
              {/* + and - symbols */}
              <text x="0" y="-12" textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">+</text>
              <text x="0" y="24" textAnchor="middle" fill="#38bdf8" fontSize="14" fontWeight="bold">-</text>
              <text x="0" y="6" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">{batteryVoltage}V</text>
            </g>

            {/* RIGHT COMPONENT: Lightbulb or Fan */}
            <g transform="translate(400, 150)">
              {loadType === 'bulb' ? (
                <>
                  {/* Glow circle if glowing */}
                  {isGlowing && (
                    <circle
                      cx="0"
                      cy="0"
                      r={25 + (batteryVoltage / 9) * 20}
                      fill="url(#bulbGlow)"
                      className="animate-pulse"
                    />
                  )}
                  {/* Bulb Glass */}
                  <circle
                    cx="0"
                    cy="-6"
                    r="20"
                    fill={isGlowing ? '#fef08a' : '#334155'}
                    stroke={isGlowing ? '#f59e0b' : '#64748b'}
                    strokeWidth="2.5"
                    className="transition-colors duration-300"
                  />
                  {/* Filament */}
                  <path
                    d="M -7 4 L -4 -10 L 4 -10 L 7 4"
                    fill="none"
                    stroke={isGlowing ? '#ef4444' : '#64748b'}
                    strokeWidth="2"
                  />
                  {/* Socket */}
                  <rect x="-10" y="14" width="20" height="12" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                </>
              ) : (
                <>
                  {/* Fan housing */}
                  <circle cx="0" cy="0" r="26" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                  {/* Blades */}
                  <g className={switchClosed ? "animate-spin" : ""} style={{ transformOrigin: 'center' }}>
                    <path d="M 0 0 C 10 -15, 20 -10, 0 -22 C -20 -10, -10 -15, 0 0 Z" fill="#38bdf8" opacity="0.9" />
                    <path d="M 0 0 C 15 10, 10 20, 22 0 C 10 -20, 15 -10, 0 0 Z" fill="#38bdf8" opacity="0.9" />
                    <path d="M 0 0 C -10 15, -20 10, 0 22 C 20 10, 10 15, 0 0 Z" fill="#38bdf8" opacity="0.9" />
                  </g>
                  <circle cx="0" cy="0" r="5" fill="#f8fafc" />
                </>
              )}
            </g>

            {/* BOTTOM COMPONENT: Resistor */}
            <g transform="translate(250, 220)">
              {/* Zig-zag resistor wire */}
              <rect x="-40" y="-12" width="80" height="24" rx="4" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
              <path
                d="M -30 0 L -20 -6 L -10 6 L 0 -6 L 10 6 L 20 -6 L 30 0"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
              />
              <text x="0" y="24" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">
                {resistorValue} Ω RESISTOR
              </text>
            </g>

            <defs>
              <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Live Feedback notification */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-4 py-1.5 rounded-full text-xs font-bold text-slate-300">
          {switchClosed ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">Closed Circuit! Electrons flowing continuously in a loop!</span>
            </>
          ) : (
            <>
              <Power className="w-4 h-4 text-rose-400" />
              <span className="text-rose-300">Open Circuit: The gap stops the electron flow! Click the switch to close.</span>
            </>
          )}
        </div>
      </div>

      {/* Circuit Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
        {/* Battery Voltage */}
        <div className="space-y-2">
          <span className="text-sm font-semibold text-slate-300 block">Battery Voltage</span>
          <div className="flex gap-2">
            {[1.5, 3.0, 9.0].map(v => (
              <button
                key={v}
                onClick={() => {
                  setBatteryVoltage(v);
                  sound.play('click');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  batteryVoltage === v
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {v}V {v === 9 ? '⚡ Turbo' : v === 3 ? '🔋 Standard' : '💡 Gentle'}
              </button>
            ))}
          </div>
        </div>

        {/* Resistor Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-slate-300">Resistance (Wire Restrictor)</span>
            <span className="text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800 text-xs">
              {resistorValue} Ω
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="25"
            value={resistorValue}
            onChange={(e) => {
              setResistorValue(Number(e.target.value));
              sound.play('click');
            }}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>5Ω (Fast flow)</span>
            <span>15Ω</span>
            <span>25Ω (Slow flow)</span>
          </div>
        </div>

        {/* Big Switch Button */}
        <div className="flex items-center">
          <button
            onClick={toggleSwitch}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl ${
              switchClosed
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-400/20'
            }`}
          >
            <Power className="w-5 h-5" />
            <span>{switchClosed ? 'DISCONNECT SWITCH (OPEN)' : 'CONNECT SWITCH (CLOSE CIRCUIT)'}</span>
          </button>
        </div>
      </div>

      {/* Physics Secret Panel */}
      <div className="bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-slate-900 border border-amber-800/40 p-4 rounded-2xl flex items-start gap-3">
        <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-slate-300 space-y-1">
          <div className="font-bold text-amber-300">How Electricity Moves:</div>
          <div>
            Electrons are tiny charged subatomic particles that march through metal conductors like copper wires.
            They only flow when there is an <strong>unbroken circle (closed circuit)</strong> from the battery's negative terminal back to its positive terminal.
            If the switch opens even by one millimeter, the flow stops across the entire loop at the speed of light!
          </div>
        </div>
      </div>
    </div>
  );
}
