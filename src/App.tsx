import { useState, useMemo } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { Category, AgeGroup } from './types';
import { LABS } from './data/wonderData';
import { Navbar } from './components/Navbar';
import { LabCard } from './components/LabCard';
import { MascotNova } from './components/MascotNova';
import { BadgeModal } from './components/BadgeModal';
import { CertificateModal } from './components/CertificateModal';
import { FactCardsModal } from './components/FactCardsModal';
import { ProfileModal } from './components/ProfileModal';

// Physics Labs
import { GravityLab } from './components/physics/GravityLab';
import { SeesawLab } from './components/physics/SeesawLab';
import { OpticsLab } from './components/physics/OpticsLab';
import { CoasterLab } from './components/physics/CoasterLab';
import { CircuitLab } from './components/physics/CircuitLab';

// Math Labs
import { FractionBakery } from './components/math/FractionBakery';
import { GeometryTransformer } from './components/math/GeometryTransformer';
import { CoordinateCannon } from './components/math/CoordinateCannon';
import { MathArcade } from './components/math/MathArcade';

// Story Quests
import { CosmoQuest } from './components/quests/CosmoQuest';

import { ArrowLeft, Sparkles, Compass, Rocket, BookOpen, Flame, Heart } from 'lucide-react';
import { sound } from './utils/sound';

function MainApp() {
  const { profile, lastAward, dismissAward } = useUser();

  const [currentCategory, setCurrentCategory] = useState<Category>('all');
  const [ageFilter, setAgeFilter] = useState<AgeGroup | 'all'>('all');
  const [activeLabId, setActiveLabId] = useState<string | null>(null);

  // Modals
  const [isBadgesOpen, setIsBadgesOpen] = useState<boolean>(false);
  const [isCertOpen, setIsCertOpen] = useState<boolean>(false);
  const [isFactsOpen, setIsFactsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Filtered Labs
  const filteredLabs = useMemo(() => {
    return LABS.filter(lab => {
      const matchCat =
        currentCategory === 'all' ||
        (currentCategory === 'physics' && lab.category === 'physics') ||
        (currentCategory === 'math' && lab.category === 'math');

      const matchAge =
        ageFilter === 'all' || lab.ageGroup.includes(ageFilter);

      return matchCat && matchAge;
    });
  }, [currentCategory, ageFilter]);

  const activeLab = LABS.find(l => l.id === activeLabId);

  const handleSelectCategory = (cat: Category) => {
    setCurrentCategory(cat);
    if (cat === 'quests') {
      setActiveLabId('quest_mode');
    } else if (cat === 'arcade') {
      setActiveLabId('arcade');
    } else {
      if (activeLabId === 'quest_mode' || activeLabId === 'arcade') {
        setActiveLabId(null);
      }
    }
  };

  const handleLaunchLab = (labId: string) => {
    setActiveLabId(labId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        currentCategory={currentCategory}
        onSelectCategory={handleSelectCategory}
        ageFilter={ageFilter}
        onSelectAgeFilter={setAgeFilter}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onOpenCertificate={() => setIsCertOpen(true)}
        onOpenFacts={() => setIsFactsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Reward Pop-up Banner */}
      {lastAward && (
        <div className="fixed top-20 right-6 z-50 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-black text-sm animate-bounce-slight border-2 border-white/40">
          <Sparkles className="w-5 h-5 shrink-0" />
          <span>{lastAward}</span>
          <button
            onClick={dismissAward}
            className="ml-2 text-slate-950/70 hover:text-slate-950 text-base"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Active Lab View or Hero Dashboard */}
        {activeLabId ? (
          <div className="space-y-6">
            {/* Breadcrumb Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <button
                onClick={() => {
                  setActiveLabId(null);
                  sound.play('click');
                }}
                className="flex items-center gap-2 text-sm font-black text-amber-400 hover:text-amber-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All WonderLabs</span>
              </button>

              <div className="flex items-center gap-2">
                {activeLab && (
                  <span className="text-xs text-slate-400">
                    Category: <strong className="text-white uppercase">{activeLab.category}</strong>
                  </span>
                )}
                <button
                  onClick={() => setIsFactsOpen(true)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Science Secret</span>
                </button>
              </div>
            </div>

            {/* Render Specific Lab Component */}
            {activeLabId === 'gravity' && <GravityLab />}
            {activeLabId === 'seesaw' && <SeesawLab />}
            {activeLabId === 'optics' && <OpticsLab />}
            {activeLabId === 'coaster' && <CoasterLab />}
            {activeLabId === 'circuit' && <CircuitLab />}
            {activeLabId === 'fractions' && <FractionBakery />}
            {activeLabId === 'geometry' && <GeometryTransformer />}
            {activeLabId === 'cannon' && <CoordinateCannon />}
            {activeLabId === 'arcade' && <MathArcade />}
            {activeLabId === 'quest_mode' && <CosmoQuest />}
          </div>
        ) : (
          /* Dashboard Home View */
          <div className="space-y-10">
            {/* Playful Hero Section */}
            <div className="relative rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-blue-950/60 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
              {/* Background ambient orbs */}
              <div className="absolute top-0 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-black text-amber-300">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{profile.streak} DAY SCIENCE STREAK 🔥</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-wide font-heading leading-tight">
                  Touch, Experiment & Learn <span className="text-amber-400">Math & Physics!</span>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Welcome aboard, Cadet! Launch rockets across planets, balance seesaws with torque,
                  bend rainbow lasers, slice delicious pizza fractions, and explore geometry in a hands-on cosmic playground.
                </p>

                {/* Quick Action CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => handleLaunchLab('gravity')}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm transition-all active:scale-95 shadow-xl shadow-orange-500/20"
                  >
                    <Rocket className="w-4 h-4" />
                    <span>Launch Gravity Lab</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentCategory('quests');
                      setActiveLabId('quest_mode');
                      sound.play('launch');
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all active:scale-95"
                  >
                    <Compass className="w-4 h-4 text-purple-400" />
                    <span>Start Cosmo Quest</span>
                  </button>

                  <button
                    onClick={() => setIsFactsOpen(true)}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 font-bold text-sm border border-slate-800 transition-all active:scale-95"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Did You Know?</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl">
                  ⭐
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Cadet Rank</div>
                  <div className="text-white font-black text-base">Level {profile.level}</div>
                </div>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl">
                  🏆
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Badges Earned</div>
                  <div className="text-white font-black text-base">{profile.badges.length} / 10</div>
                </div>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xl">
                  🚀
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Labs Explored</div>
                  <div className="text-white font-black text-base">{profile.completedLabs.length} / 9</div>
                </div>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center text-xl">
                  ✨
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Total Cosmic XP</div>
                  <div className="text-white font-black text-base">{profile.xp} XP</div>
                </div>
              </div>
            </div>

            {/* Labs Section Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-wide font-heading">
                    Interactive WonderLabs
                  </h2>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Click any lab card to launch simulation controls and hands-on experiments!
                  </p>
                </div>

                <div className="text-xs text-slate-400 font-bold">
                  Showing {filteredLabs.length} of {LABS.length} Labs
                </div>
              </div>

              {/* Grid of WonderLabs Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLabs.map(lab => (
                  <LabCard
                    key={lab.id}
                    lab={lab}
                    onSelect={() => handleLaunchLab(lab.id)}
                  />
                ))}
              </div>
            </div>

            {/* Featured Story Quest Banner */}
            <div className="bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-900 border border-purple-500/30 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 bg-purple-950 px-2.5 py-1 rounded-full border border-purple-800">
                  FEATURED ADVENTURE
                </span>
                <h3 className="text-2xl font-black text-white font-heading">
                  Cosmo Quest: 10 Galactic Missions
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Join Pip the Space Fox and Curie the Robot on a story quest! Solve physics riddles,
                  calculate spaceship fractions, and earn the coveted <strong>Galactic Graduate Trophy</strong>.
                </p>
              </div>

              <button
                onClick={() => {
                  setCurrentCategory('quests');
                  setActiveLabId('quest_mode');
                  sound.play('launch');
                }}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-black text-sm whitespace-nowrap transition-all active:scale-95 shadow-xl shadow-purple-500/20 flex items-center gap-2"
              >
                <span>Embark on Quest</span>
                <Compass className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Animated Mascot Nova */}
      <MascotNova />

      {/* Modals */}
      <BadgeModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
      />

      <CertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
      />

      <FactCardsModal
        isOpen={isFactsOpen}
        onClose={() => setIsFactsOpen(false)}
        onLaunchLab={handleLaunchLab}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Educational Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-1.5 font-bold text-slate-400">
          <span>WonderLab Kids</span>
          <span>•</span>
          <span>Hands-on Interactive Math & Physics for Young Explorers</span>
          <span>•</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
        </div>
        <p className="text-[11px] text-slate-600">
          Designed with Newton's laws, Archimedes' balance, Snell's optics, kinetic energy conservation, and fraction pedagogy.
        </p>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}

export default App;
