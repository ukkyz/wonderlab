import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Zap, Gauge, Award } from 'lucide-react';
import { sound } from '../../utils/sound';
import { fireCelebration } from '../../utils/confetti';
import { useUser } from '../../context/UserContext';

export function CoasterLab() {
  const { addXp, unlockBadge, completeLab } = useUser();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hill1, setHill1] = useState<number>(85); // 0-100 height percentage
  const [hill2, setHill2] = useState<number>(55);
  const [friction, setFriction] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Live Energy telemetry
  const [energyState, setEnergyState] = useState({
    potential: 85,
    kinetic: 0,
    total: 85,
    speed: 0,
    progress: 0,
    statusText: 'Ready at the summit peak!'
  });

  const animRef = useRef<number | null>(null);
  const cartPosRef = useRef<number>(0); // 0 to 1 along track

  // Track generator function
  // returns { x, y, slope } for progress t in [0, 1]
  const getTrackPoint = (t: number, width: number, height: number) => {
    const startX = 60;
    const endX = width - 60;
    const x = startX + t * (endX - startX);

    // Height calculations
    const groundY = height - 60;
    const maxDrop = height - 120;

    let y = groundY;

    if (t < 0.3) {
      // Hill 1 slope down
      const localT = t / 0.3;
      const hPeak = groundY - (hill1 / 100) * maxDrop;
      const cosVal = Math.cos(localT * Math.PI); // 1 -> -1
      y = hPeak + ((1 - cosVal) / 2) * ((hill1 / 100) * maxDrop);
    } else if (t < 0.65) {
      // Hill 2 or Loop
      const localT = (t - 0.3) / 0.35;
      const valleyY = groundY;
      const h2Peak = groundY - (hill2 / 100) * maxDrop;
      const sinVal = Math.sin(localT * Math.PI); // 0 -> 1 -> 0
      y = valleyY - sinVal * (valleyY - h2Peak);
    } else {
      // Exit slope to station
      const localT = (t - 0.65) / 0.35;
      const valleyY = groundY;
      y = valleyY - Math.sin((1 - localT) * Math.PI * 0.5) * 20;
    }

    return { x, y };
  };

  const handleStart = () => {
    if (isRunning) return;
    setIsRunning(true);
    sound.play('launch');
    cartPosRef.current = 0;

    // Simulation loop
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const currentPoint = getTrackPoint(cartPosRef.current, canvas.width, canvas.height);
      const groundY = canvas.height - 60;
      const currentHeight = Math.max(0, groundY - currentPoint.y);

      // Potential Energy proportional to current height
      const pe = Math.round((currentHeight / (canvas.height - 120)) * 100);

      // Total energy based on initial hill 1 (with friction deduction)
      let total = hill1;
      if (friction) {
        total = Math.max(pe, Math.round(hill1 * (1 - cartPosRef.current * 0.25)));
      }

      // Check if second hill is taller than available total energy
      if (cartPosRef.current > 0.4 && cartPosRef.current < 0.6 && pe > total) {
        // Stalled on hill 2!
        setIsRunning(false);
        sound.play('gentleBoop');
        setEnergyState({
          potential: pe,
          kinetic: 0,
          total,
          speed: 0,
          progress: cartPosRef.current,
          statusText: '⚠️ Stalled! Hill 2 is too tall for initial potential energy!'
        });
        drawCanvas();
        return;
      }

      const ke = Math.max(0, total - pe);
      const speed = Math.round(Math.sqrt(ke) * 8.5);

      setEnergyState({
        potential: pe,
        kinetic: ke,
        total,
        speed,
        progress: cartPosRef.current,
        statusText: ke > pe ? '💨 High Kinetic Energy (Maximum Speed)!' : '⛰️ High Potential Energy (High Altitude)!'
      });

      // Advance cart
      const speedFactor = Math.max(0.12, Math.sqrt(ke) * 0.08);
      cartPosRef.current += dt * speedFactor * 0.4;

      if (cartPosRef.current >= 1.0) {
        cartPosRef.current = 1.0;
        setIsRunning(false);
        sound.play('fanfare');
        fireCelebration();
        unlockBadge('badge_coaster');
        completeLab('coaster');
        addXp(40, 'Completed high-speed coaster run conserving mechanical energy!');
        setEnergyState(prev => ({ ...prev, statusText: '🎉 Smooth station stop! Total Energy Conserved!' }));
        drawCanvas();
        return;
      }

      drawCanvas();
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
  };

  const handleReset = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setIsRunning(false);
    cartPosRef.current = 0;
    sound.play('click');
    setEnergyState({
      potential: hill1,
      kinetic: 0,
      total: hill1,
      speed: 0,
      progress: 0,
      statusText: 'Ready at the summit peak!'
    });
    drawCanvas();
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Night theme amusement park background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 25; i++) {
      const sx = (i * 47) % canvas.width;
      const sy = (i * 19) % (canvas.height - 120);
      ctx.globalAlpha = 0.35 + (i % 4) * 0.15;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Ground platform
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, canvas.height - 45, canvas.width, 45);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 45);
    ctx.lineTo(canvas.width, canvas.height - 45);
    ctx.stroke();

    // Draw Support Pillars
    ctx.strokeStyle = '#47556944';
    ctx.lineWidth = 3;
    for (let p = 0.05; p <= 0.95; p += 0.1) {
      const pt = getTrackPoint(p, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(pt.x, canvas.height - 45);
      ctx.stroke();

      // Cross struts
      ctx.beginPath();
      ctx.moveTo(pt.x - 8, pt.y + 15);
      ctx.lineTo(pt.x + 8, pt.y + 35);
      ctx.stroke();
    }

    // Draw Rollercoaster Rail
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();
    const startPt = getTrackPoint(0, canvas.width, canvas.height);
    ctx.moveTo(startPt.x, startPt.y);

    const steps = 100;
    for (let i = 1; i <= steps; i++) {
      const pt = getTrackPoint(i / steps, canvas.width, canvas.height);
      ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    // Secondary rail
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(startPt.x, startPt.y - 4);
    for (let i = 1; i <= steps; i++) {
      const pt = getTrackPoint(i / steps, canvas.width, canvas.height);
      ctx.lineTo(pt.x, pt.y - 4);
    }
    ctx.stroke();

    // Draw Coaster Cart
    const currentPt = getTrackPoint(cartPosRef.current, canvas.width, canvas.height);
    const nextPt = getTrackPoint(Math.min(1, cartPosRef.current + 0.02), canvas.width, canvas.height);
    const cartAngle = Math.atan2(nextPt.y - currentPt.y, nextPt.x - currentPt.x);

    ctx.save();
    ctx.translate(currentPt.x, currentPt.y - 10);
    ctx.rotate(cartAngle);

    // Cart Wheels
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-10, 8, 4, 0, Math.PI * 2);
    ctx.arc(10, 8, 4, 0, Math.PI * 2);
    ctx.fill();

    // Cart Body
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(-16, -6, 32, 14, 4);
    ctx.fill();

    // Racing Stripe
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-16, -1, 32, 3);

    // Happy Astro Passenger
    ctx.font = '14px sans-serif';
    ctx.fillText('🦊', -7, -8);

    ctx.restore();
  };

  useEffect(() => {
    drawCanvas();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [hill1, hill2, friction]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎢</span>
            <h2 className="text-2xl font-bold text-white tracking-wide">Energy Coaster Playground</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Watch <strong>Potential Energy</strong> (height) transform into <strong>Kinetic Energy</strong> (speed)!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-slate-950 transition-all ${
              isRunning
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-400/20 active:scale-95'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRunning ? 'Zooming...' : 'Release Cart!'}</span>
          </button>
          <button
            onClick={handleReset}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 transition-all active:scale-95"
            title="Reset Cart"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Track */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
        <canvas
          ref={canvasRef}
          width={700}
          height={340}
          className="w-full h-[300px] sm:h-[340px] object-contain block"
        />

        {/* Speedometer Badge */}
        <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2.5 backdrop-blur-md">
          <Gauge className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Cart Speed</div>
            <div className="text-emerald-400 font-extrabold text-base">{energyState.speed} km/h</div>
          </div>
        </div>

        {/* Status ticker */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-slate-800 px-4 py-1.5 rounded-full text-xs text-white font-semibold backdrop-blur-md">
          {energyState.statusText}
        </div>
      </div>

      {/* Live Conservation of Energy Visualizer Bars */}
      <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400">
          <span className="flex items-center gap-1.5 text-white">
            <Zap className="w-4 h-4 text-amber-400" /> Conservation of Mechanical Energy
          </span>
          <span className="text-amber-400 font-mono">PE + KE = Total</span>
        </div>

        {/* Energy Bars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Potential Energy (Blue) */}
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-blue-400">Potential (Height)</span>
              <span className="text-white font-mono">{energyState.potential}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-75"
                style={{ width: `${energyState.potential}%` }}
              />
            </div>
          </div>

          {/* Kinetic Energy (Green) */}
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-emerald-400">Kinetic (Speed)</span>
              <span className="text-white font-mono">{energyState.kinetic}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-75"
                style={{ width: `${energyState.kinetic}%` }}
              />
            </div>
          </div>

          {/* Total Energy (Gold) */}
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-amber-400">Total Energy</span>
              <span className="text-white font-mono">{energyState.total}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-75"
                style={{ width: `${energyState.total}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Track Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
        {/* Hill 1 Height */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-slate-300">Hill 1 Summit (Drop Height)</span>
            <span className="text-blue-400 font-bold bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-800 text-xs">
              {hill1}m
            </span>
          </div>
          <input
            type="range"
            min="40"
            max="100"
            value={hill1}
            disabled={isRunning}
            onChange={(e) => {
              setHill1(Number(e.target.value));
              sound.play('click');
            }}
            className="w-full accent-blue-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Hill 2 Height */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-slate-300">Hill 2 Peak</span>
            <span className="text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800 text-xs">
              {hill2}m
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="95"
            value={hill2}
            disabled={isRunning}
            onChange={(e) => {
              setHill2(Number(e.target.value));
              sound.play('click');
            }}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Friction Toggle */}
        <div className="flex flex-col justify-center space-y-2">
          <span className="text-sm font-semibold text-slate-300">Track Friction</span>
          <button
            onClick={() => {
              setFriction(!friction);
              sound.play('pop');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
              friction
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
            }`}
          >
            {friction ? '🔥 Air Resistance & Friction: ON' : '🧊 Frictionless Ice Track: IDEAL'}
          </button>
        </div>
      </div>

      {/* Physics Takeaway */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-800/40 p-4 rounded-2xl flex items-start gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
          <Award className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-slate-300 space-y-1">
          <div className="font-bold text-emerald-300">The Universal Energy Law:</div>
          <div>
            Energy can neither be created nor destroyed—it only changes form! At the top of Hill 1, all energy is <strong>Potential</strong>.
            At the bottom of the valley, it transforms into pure <strong>Kinetic</strong> motion.
            If Hill 2 is taller than Hill 1, the cart won't have enough kinetic energy to reach the top without an extra motor boost!
          </div>
        </div>
      </div>
    </div>
  );
}
