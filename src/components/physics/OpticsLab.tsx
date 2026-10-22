import { useState, useEffect, useRef } from 'react';
import { Sun, RefreshCw, Compass } from 'lucide-react';
import { sound } from '../../utils/sound';
import { fireCelebration } from '../../utils/confetti';
import { useUser } from '../../context/UserContext';

type ToolType = 'prism' | 'mirror' | 'lens';

const RAINBOW_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
];

export function OpticsLab() {
  const { addXp, unlockBadge, completeLab } = useUser();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeTool, setActiveTool] = useState<ToolType>('prism');
  const [laserAngle, setLaserAngle] = useState<number>(18); // degrees
  const [laserType, setLaserType] = useState<'white' | 'red' | 'cyan' | 'green'>('white');
  const [toolAngle, setToolAngle] = useState<number>(0); // rotation of active element
  const [targetHit, setTargetHit] = useState<boolean>(false);

  // Target crystal position
  const targetCrystal = { x: 580, y: 190, radius: 24 };

  const checkHits = (px: number, py: number) => {
    const dist = Math.hypot(px - targetCrystal.x, py - targetCrystal.y);
    if (dist < targetCrystal.radius + 10) {
      if (!targetHit) {
        setTargetHit(true);
        sound.play('fanfare');
        fireCelebration();
        unlockBadge('badge_optics');
        completeLab('optics');
        addXp(35, 'Powered up the ancient crystal with focused light!');
      }
    }
  };

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Deep space background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle optical grid
    ctx.strokeStyle = '#1e293b40';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Laser Emitter Box
    const emitterX = 50;
    const emitterY = 200;

    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(emitterX - 35, emitterY - 20, 45, 40, 8);
    ctx.fill();
    ctx.stroke();

    // Laser nozzle
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(emitterX + 10, emitterY - 5, 10, 10);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Fredoka, sans-serif';
    ctx.fillText('LASER', emitterX - 28, emitterY + 4);

    // Calculate initial laser vector
    const rad = (laserAngle * Math.PI) / 180;

    // Optical element position in the middle
    const elemX = 320;
    const elemY = 200;

    // Laser color settings
    let beamColor = '#ffffff';
    if (laserType === 'red') beamColor = '#ef4444';
    if (laserType === 'cyan') beamColor = '#06b6d4';
    if (laserType === 'green') beamColor = '#22c55e';

    // Draw active element
    ctx.save();
    ctx.translate(elemX, elemY);
    ctx.rotate((toolAngle * Math.PI) / 180);

    if (activeTool === 'prism') {
      // Glass Prism Triangle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -65);
      ctx.lineTo(55, 55);
      ctx.lineTo(-55, 55);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glass shine highlight
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.moveTo(-15, -20);
      ctx.lineTo(25, 40);
      ctx.stroke();
    } else if (activeTool === 'mirror') {
      // Silver Mirror Strip
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-6, -70, 12, 140);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-2, -68, 4, 136);

      // Backing support
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(-12, -60);
      ctx.lineTo(-6, -70);
      ctx.lineTo(-6, 70);
      ctx.lineTo(-12, 60);
      ctx.fill();
    } else if (activeTool === 'lens') {
      // Convex Glass Lens
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 22, 65, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // Laser Beam 1: Emitter to Element
    ctx.save();
    ctx.shadowBlur = 12;
    ctx.shadowColor = beamColor;
    ctx.strokeStyle = beamColor;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(emitterX + 20, emitterY);
    ctx.lineTo(elemX - 30, elemY + (elemX - 30 - (emitterX + 20)) * Math.tan(rad));
    ctx.stroke();
    ctx.restore();

    const hitY = elemY + (elemX - 30 - (emitterX + 20)) * Math.tan(rad);

    // If within interaction range of center element:
    const isHittingElement = Math.abs(hitY - elemY) < 55;

    if (isHittingElement) {
      if (activeTool === 'prism') {
        // Rainbow Dispersion!
        if (laserType === 'white') {
          RAINBOW_COLORS.forEach((color, idx) => {
            const spreadAngle = rad - 0.22 + idx * 0.07;
            const endX = canvas.width - 20;
            const endY = hitY + (endX - elemX) * Math.tan(spreadAngle);

            ctx.save();
            ctx.shadowBlur = 8;
            ctx.shadowColor = color;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(elemX + 20, hitY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            ctx.restore();

            checkHits(endX, endY);
          });
        } else {
          // Monochromatic light bending
          const outAngle = rad + 0.15;
          const endX = canvas.width - 20;
          const endY = hitY + (endX - elemX) * Math.tan(outAngle);

          ctx.save();
          ctx.shadowBlur = 10;
          ctx.shadowColor = beamColor;
          ctx.strokeStyle = beamColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(elemX + 20, hitY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          ctx.restore();

          checkHits(endX, endY);
        }
      } else if (activeTool === 'mirror') {
        // Law of Reflection: Angle of incidence = Angle of reflection
        const mirrorRad = (toolAngle * Math.PI) / 180;
        const reflectedAngle = -rad + 2 * mirrorRad;
        const endX = elemX + Math.cos(reflectedAngle) * 280;
        const endY = hitY + Math.sin(reflectedAngle) * 280;

        ctx.save();
        ctx.shadowBlur = 14;
        ctx.shadowColor = beamColor;
        ctx.strokeStyle = beamColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(elemX, hitY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();

        checkHits(endX, endY);
      } else if (activeTool === 'lens') {
        // Focusing rays
        const focalX = elemX + 160;
        const focalY = elemY;

        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = beamColor;
        ctx.strokeStyle = beamColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(elemX + 10, hitY);
        ctx.lineTo(focalX, focalY);
        ctx.lineTo(canvas.width - 20, focalY + (focalY - hitY) * 0.8);
        ctx.stroke();
        ctx.restore();

        checkHits(focalX, focalY);
      }
    } else {
      // Beam continues straight if missed
      const endX = canvas.width - 20;
      const endY = emitterY + (endX - (emitterX + 20)) * Math.tan(rad);

      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = beamColor;
      ctx.strokeStyle = beamColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(elemX - 30, hitY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.restore();

      checkHits(endX, endY);
    }

    // Draw Target Crystal
    ctx.save();
    ctx.translate(targetCrystal.x, targetCrystal.y);
    if (targetHit) {
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#38bdf8';
    }

    ctx.fillStyle = targetHit ? '#38bdf8' : '#334155';
    ctx.strokeStyle = targetHit ? '#7dd3fc' : '#64748b';
    ctx.lineWidth = 2.5;

    // Diamond shape
    ctx.beginPath();
    ctx.moveTo(0, -targetCrystal.radius);
    ctx.lineTo(targetCrystal.radius, 0);
    ctx.lineTo(0, targetCrystal.radius);
    ctx.lineTo(-targetCrystal.radius, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Glow core
    ctx.fillStyle = targetHit ? '#ffffff' : '#475569';
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Target label
    ctx.fillStyle = targetHit ? '#38bdf8' : '#64748b';
    ctx.font = 'bold 11px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(targetHit ? '✨ ACTIVATED! ✨' : 'CRYSTAL TARGET', targetCrystal.x, targetCrystal.y + 38);
  };

  useEffect(() => {
    drawScene();
  }, [activeTool, laserAngle, laserType, toolAngle, targetHit]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌈</span>
            <h2 className="text-2xl font-bold text-white tracking-wide">Rainbow Prism & Optics Lab</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Discover how light refracts, reflects, and splits into the 7 vibrant rainbow colors!
          </p>
        </div>

        {/* Optical Component Picker */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 gap-1.5">
          <button
            onClick={() => {
              setActiveTool('prism');
              sound.play('chime');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'prism'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔺 Glass Prism
          </button>
          <button
            onClick={() => {
              setActiveTool('mirror');
              sound.play('click');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'mirror'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🪞 Silver Mirror
          </button>
          <button
            onClick={() => {
              setActiveTool('lens');
              sound.play('pop');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'lens'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔍 Convex Lens
          </button>
        </div>
      </div>

      {/* Main Optical Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
        <canvas
          ref={canvasRef}
          width={700}
          height={380}
          className="w-full h-[320px] sm:h-[380px] object-contain block"
        />

        {/* Rainbow Spectrogram Banner */}
        {activeTool === 'prism' && laserType === 'white' && (
          <div className="absolute top-4 right-4 bg-slate-900/90 border border-purple-500/40 rounded-xl p-3 flex flex-col items-center gap-1.5 shadow-xl backdrop-blur-md">
            <span className="text-[11px] font-bold text-purple-300">ROYGBIV SPECTRUM</span>
            <div className="flex gap-1">
              {RAINBOW_COLORS.map((col, idx) => (
                <div
                  key={idx}
                  className="w-3.5 h-6 rounded-sm shadow-md"
                  style={{ backgroundColor: col }}
                  title={['Red', 'Orange', 'Yellow', 'Green', 'Cyan', 'Blue', 'Violet'][idx]}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Optical Controls & Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
        {/* Laser Angle */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Compass className="w-4 h-4 text-purple-400" /> Laser Aim Angle
            </span>
            <span className="text-purple-400 font-bold bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-800 text-xs">
              {laserAngle}°
            </span>
          </div>
          <input
            type="range"
            min="-25"
            max="25"
            value={laserAngle}
            onChange={(e) => {
              setLaserAngle(Number(e.target.value));
              sound.play('click');
            }}
            className="w-full accent-purple-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Rotate Tool / Mirror / Prism */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="flex items-center gap-1.5 text-slate-300">
              <RefreshCw className="w-4 h-4 text-cyan-400" /> Rotate {activeTool}
            </span>
            <span className="text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800 text-xs">
              {toolAngle}°
            </span>
          </div>
          <input
            type="range"
            min="-45"
            max="45"
            value={toolAngle}
            onChange={(e) => {
              setToolAngle(Number(e.target.value));
              sound.play('click');
            }}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Beam Color Picker */}
        <div className="space-y-2">
          <span className="text-sm font-semibold text-slate-300 block">Laser Light Color</span>
          <div className="flex gap-2">
            {[
              { id: 'white', label: 'White', color: 'bg-white text-slate-950' },
              { id: 'red', label: 'Red', color: 'bg-red-500 text-white' },
              { id: 'cyan', label: 'Cyan', color: 'bg-cyan-400 text-slate-950' },
              { id: 'green', label: 'Green', color: 'bg-emerald-400 text-slate-950' },
            ].map(col => (
              <button
                key={col.id}
                onClick={() => {
                  setLaserType(col.id as any);
                  sound.play('laser');
                }}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                  laserType === col.id
                    ? `${col.color} border-white shadow-lg`
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {col.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Educational Callout */}
      <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-800/40 p-4 rounded-2xl flex items-start gap-3">
        <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
          <Sun className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-slate-300 space-y-1">
          <div className="font-bold text-purple-300">Why Does White Light Split?</div>
          <div>
            White light isn't just one color—it is made of every color of the rainbow traveling together!
            When light enters the denser glass prism, it slows down and bends (<strong>refraction</strong>).
            Blue and violet light bend the most, while red light bends the least, separating them into a brilliant spectrum!
          </div>
        </div>
      </div>
    </div>
  );
}
