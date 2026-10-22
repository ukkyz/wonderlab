import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Flame, Compass, Target, Sparkles } from 'lucide-react';
import { sound } from '../../utils/sound';
import { fireCelebration } from '../../utils/confetti';
import { useUser } from '../../context/UserContext';

interface Planet {
  id: string;
  name: string;
  emoji: string;
  gravity: number; // m/s^2
  skyColor: string;
  groundColor: string;
  description: string;
}

const PLANETS: Planet[] = [
  { id: 'earth', name: 'Earth', emoji: '🌍', gravity: 9.8, skyColor: 'from-sky-900 to-indigo-950', groundColor: '#15803d', description: 'Standard gravity (9.8 m/s²). Heavy atmosphere.' },
  { id: 'moon', name: 'Moon', emoji: '🌕', gravity: 1.6, skyColor: 'from-slate-950 to-zinc-900', groundColor: '#64748b', description: 'Super light gravity (1.6 m/s²)! Jump 6× higher.' },
  { id: 'mars', name: 'Mars', emoji: '🪐', gravity: 3.7, skyColor: 'from-red-950 to-amber-950', groundColor: '#b45309', description: 'Moderate gravity (3.7 m/s²). Dusty red world.' },
  { id: 'jupiter', name: 'Jupiter', emoji: '⭐', gravity: 24.8, skyColor: 'from-amber-950 to-stone-950', groundColor: '#78350f', description: 'Crushing gravity (24.8 m/s²)! Heavy pull!' },
];

export function GravityLab() {
  const { addXp, unlockBadge, completeLab } = useUser();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [selectedPlanet, setSelectedPlanet] = useState<Planet>(PLANETS[0]);
  const [angle, setAngle] = useState<number>(65); // degrees
  const [thrust, setThrust] = useState<number>(120); // initial power
  const [fuel, setFuel] = useState<number>(60);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [hasLanded, setHasLanded] = useState<boolean>(false);
  const [landingStatus, setLandingStatus] = useState<string | null>(null);
  const [visitedPlanets, setVisitedPlanets] = useState<Set<string>>(new Set(['earth']));

  // Telemetry
  const [stats, setStats] = useState({
    altitude: 0,
    maxAltitude: 0,
    speed: 0,
    distance: 0,
    flightTime: 0
  });

  // Target Pad
  const [targetPad] = useState<{ x: number; width: number }>({ x: 480, width: 90 });

  // Physics animation state
  const simRef = useRef({
    x: 50,
    y: 350,
    vx: 0,
    vy: 0,
    fuelRemaining: 60,
    maxAlt: 0,
    trail: [] as { x: number; y: number }[],
    animId: 0,
    startTime: 0
  });

  const resetSimulation = () => {
    if (simRef.current.animId) {
      cancelAnimationFrame(simRef.current.animId);
    }
    setIsLaunching(false);
    setHasLanded(false);
    setLandingStatus(null);
    simRef.current = {
      x: 50,
      y: 350,
      vx: 0,
      vy: 0,
      fuelRemaining: fuel,
      maxAlt: 0,
      trail: [],
      animId: 0,
      startTime: 0
    };
    setStats({
      altitude: 0,
      maxAltitude: 0,
      speed: 0,
      distance: 0,
      flightTime: 0
    });
    sound.play('click');
    drawScene();
  };

  const handleLaunch = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    setHasLanded(false);
    setLandingStatus(null);
    sound.play('launch');

    const rad = (angle * Math.PI) / 180;
    const initialSpeed = thrust * 0.45;
    simRef.current = {
      x: 50,
      y: 350,
      vx: Math.cos(rad) * initialSpeed,
      vy: -Math.sin(rad) * initialSpeed,
      fuelRemaining: fuel,
      maxAlt: 0,
      trail: [{ x: 50, y: 350 }],
      animId: 0,
      startTime: Date.now()
    };

    const newVisited = new Set(visitedPlanets);
    newVisited.add(selectedPlanet.id);
    setVisitedPlanets(newVisited);
    if (newVisited.size >= 3) {
      unlockBadge('badge_gravity');
    }

    animatePhysics();
  };

  const animatePhysics = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gScale = selectedPlanet.gravity * 0.04;
    const groundY = 350;

    const step = () => {
      const sim = simRef.current;
      sim.vy += gScale; // Gravity pulls down
      sim.x += sim.vx * 0.18;
      sim.y += sim.vy * 0.18;

      const alt = Math.max(0, Math.round(groundY - sim.y));
      if (alt > sim.maxAlt) sim.maxAlt = alt;

      const currentSpeed = Math.round(Math.sqrt(sim.vx * sim.vx + sim.vy * sim.vy));
      const dist = Math.round(sim.x - 50);
      const elapsed = ((Date.now() - sim.startTime) / 1000).toFixed(1);

      setStats({
        altitude: alt,
        maxAltitude: sim.maxAlt,
        speed: currentSpeed,
        distance: Math.max(0, dist),
        flightTime: parseFloat(elapsed)
      });

      // record trail
      if (sim.trail.length % 2 === 0) {
        sim.trail.push({ x: sim.x, y: sim.y });
      }

      // Check ground collision
      if (sim.y >= groundY) {
        sim.y = groundY;
        setIsLaunching(false);
        setHasLanded(true);

        const onPad = sim.x >= targetPad.x - 15 && sim.x <= targetPad.x + targetPad.width + 15;
        const gentleLanding = sim.vy < 14;

        if (onPad && gentleLanding) {
          sound.play('fanfare');
          fireCelebration();
          setLandingStatus('🎯 Perfect Landing on Target Pad! +50 XP');
          addXp(50, 'Mastered rocket landing precision!');
          completeLab('gravity');
        } else if (onPad && !gentleLanding) {
          sound.play('boing');
          setLandingStatus('💥 Hard Touchdown! Thrusters hit too fast.');
        } else {
          sound.play('pop');
          setLandingStatus('🛬 Landed safely in open terrain.');
          addXp(15, 'Rocket flight completed');
        }

        drawScene();
        return;
      }

      drawScene();
      sim.animId = requestAnimationFrame(step);
    };

    simRef.current.animId = requestAnimationFrame(step);
  };

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stars background
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 35; i++) {
      const sx = (i * 37) % canvas.width;
      const sy = (i * 23) % 260;
      const r = (i % 3 === 0) ? 1.5 : 1;
      ctx.globalAlpha = 0.4 + (i % 5) * 0.12;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Ground
    ctx.fillStyle = selectedPlanet.groundColor;
    ctx.fillRect(0, 350, canvas.width, 50);

    // Ground highlight line
    ctx.strokeStyle = '#ffffff22';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 350);
    ctx.lineTo(canvas.width, 350);
    ctx.stroke();

    // Target Landing Pad
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(targetPad.x, 346, targetPad.width, 6);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(targetPad.x + 10, 344, targetPad.width - 20, 2);

    // Pad indicator flag
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(targetPad.x + targetPad.width / 2, 346);
    ctx.lineTo(targetPad.x + targetPad.width / 2, 320);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(targetPad.x + targetPad.width / 2, 320);
    ctx.lineTo(targetPad.x + targetPad.width / 2 + 15, 327);
    ctx.lineTo(targetPad.x + targetPad.width / 2, 334);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '10px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TARGET PAD', targetPad.x + targetPad.width / 2, 362);

    // Launch Pad
    ctx.fillStyle = '#475569';
    ctx.fillRect(40, 346, 30, 4);

    // Trajectory Trail
    const sim = simRef.current;
    if (sim.trail.length > 1) {
      ctx.strokeStyle = '#38bdf888';
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(sim.trail[0].x, sim.trail[0].y);
      for (let i = 1; i < sim.trail.length; i++) {
        ctx.lineTo(sim.trail[i].x, sim.trail[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Rocket
    const rx = sim.x;
    const ry = sim.y;

    ctx.save();
    ctx.translate(rx, ry);

    // Calculate rocket tilt angle
    let rocketAngle = 0;
    if (isLaunching) {
      rocketAngle = Math.atan2(sim.vy, sim.vx) + Math.PI / 2;
    } else {
      rocketAngle = ((-angle + 90) * Math.PI) / 180;
    }
    ctx.rotate(rocketAngle);

    // Exhaust flame if launching and moving up
    if (isLaunching && sim.vy < 0) {
      ctx.fillStyle = '#fb923c';
      ctx.beginPath();
      ctx.moveTo(-5, 14);
      ctx.lineTo(0, 26 + Math.random() * 8);
      ctx.lineTo(5, 14);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(-3, 14);
      ctx.lineTo(0, 20 + Math.random() * 5);
      ctx.lineTo(3, 14);
      ctx.fill();
    }

    // Rocket Body
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(7, 10);
    ctx.lineTo(-7, 10);
    ctx.closePath();
    ctx.fill();

    // Rocket Nosecone
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(4, -6);
    ctx.lineTo(-4, -6);
    ctx.closePath();
    ctx.fill();

    // Porthole window
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    // Fins
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(-7, 5);
    ctx.lineTo(-12, 13);
    ctx.lineTo(-7, 12);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(7, 5);
    ctx.lineTo(12, 13);
    ctx.lineTo(7, 12);
    ctx.fill();

    ctx.restore();
  };

  useEffect(() => {
    drawScene();
    return () => {
      if (simRef.current.animId) cancelAnimationFrame(simRef.current.animId);
    };
  }, [selectedPlanet, angle]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🚀</span>
            <h2 className="text-2xl font-bold text-white tracking-wide">Gravity & Rocket World</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Discover Newton's gravity laws! Adjust thrust & launch angle to land on the Moonpad.
          </p>
        </div>

        {/* Planet Picker Tabs */}
        <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 gap-1 overflow-x-auto">
          {PLANETS.map(planet => (
            <button
              key={planet.id}
              onClick={() => {
                setSelectedPlanet(planet);
                sound.play('pop');
                resetSimulation();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                selectedPlanet.id === planet.id
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{planet.emoji}</span>
              <span>{planet.name}</span>
              <span className="text-[10px] opacity-75">({planet.gravity}g)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas & Flight View */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <canvas
          ref={canvasRef}
          width={700}
          height={380}
          className="w-full h-[320px] sm:h-[380px] object-contain block"
        />

        {/* Live HUD telemetry */}
        <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-3 flex flex-wrap gap-4 text-xs">
          <div>
            <div className="text-slate-400 font-semibold">WORLD GRAVITY</div>
            <div className="text-amber-400 font-bold text-base">{selectedPlanet.gravity} m/s²</div>
          </div>
          <div>
            <div className="text-slate-400 font-semibold">ALTITUDE</div>
            <div className="text-cyan-400 font-bold text-base">{stats.altitude} m</div>
          </div>
          <div>
            <div className="text-slate-400 font-semibold">MAX HEIGHT</div>
            <div className="text-emerald-400 font-bold text-base">{stats.maxAltitude} m</div>
          </div>
          <div>
            <div className="text-slate-400 font-semibold">SPEED</div>
            <div className="text-purple-400 font-bold text-base">{stats.speed} m/s</div>
          </div>
          <div>
            <div className="text-slate-400 font-semibold">DISTANCE</div>
            <div className="text-rose-400 font-bold text-base">{stats.distance} m</div>
          </div>
        </div>

        {/* Landing Status Banner */}
        {landingStatus && hasLanded && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-amber-400/50 backdrop-blur-md px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce-slight text-white font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{landingStatus}</span>
          </div>
        )}
      </div>

      {/* Control Sliders & Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
        {/* Angle Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Compass className="w-4 h-4 text-cyan-400" /> Launch Angle
            </span>
            <span className="text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800 text-xs">
              {angle}°
            </span>
          </div>
          <input
            type="range"
            min="25"
            max="85"
            value={angle}
            disabled={isLaunching}
            onChange={(e) => {
              setAngle(Number(e.target.value));
              sound.play('click');
            }}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>25° (Flat)</span>
            <span>45° (Max Range)</span>
            <span>85° (High)</span>
          </div>
        </div>

        {/* Thrust Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Flame className="w-4 h-4 text-amber-400" /> Engine Thrust
            </span>
            <span className="text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-800 text-xs">
              {thrust} kN
            </span>
          </div>
          <input
            type="range"
            min="60"
            max="180"
            step="5"
            value={thrust}
            disabled={isLaunching}
            onChange={(e) => {
              setThrust(Number(e.target.value));
              sound.play('click');
            }}
            className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Gentle</span>
            <span>Balanced</span>
            <span>Maximum</span>
          </div>
        </div>

        {/* Fuel Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Fuel Tank
            </span>
            <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800 text-xs">
              {fuel} Liters
            </span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            step="5"
            value={fuel}
            disabled={isLaunching}
            onChange={(e) => {
              setFuel(Number(e.target.value));
              sound.play('click');
            }}
            className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Light</span>
            <span>Medium</span>
            <span>Full Tank</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 md:col-span-3">
          <button
            onClick={handleLaunch}
            disabled={isLaunching}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-white shadow-xl transition-all ${
              isLaunching
                ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-95 shadow-orange-500/25'
            }`}
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{isLaunching ? 'Rocket Soaring...' : 'Ignite & Launch!'}</span>
          </button>

          <button
            onClick={resetSimulation}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 transition-all active:scale-95"
            title="Reset to Launch Pad"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Physics Insight Callout */}
      <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-slate-900 border border-blue-900/40 p-4 rounded-2xl flex items-start gap-3">
        <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400 mt-0.5">
          <Target className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-slate-300 space-y-1">
          <span className="font-bold text-blue-300">Physics Secret of Gravity: </span>
          <span>{selectedPlanet.description} </span>
          <span className="text-slate-400">
            Notice how on the <strong>Moon</strong>, the rocket arcs into a giant high parabola, while on <strong>Jupiter</strong>, the mighty 24.8 m/s² gravity pulls the rocket down right away!
          </span>
        </div>
      </div>
    </div>
  );
}
