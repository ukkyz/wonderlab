import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { fireStarBurst } from '../utils/confetti';
import { sound } from '../utils/sound';

interface UserContextType {
  profile: UserProfile;
  addXp: (amount: number, reason?: string) => void;
  unlockBadge: (badgeId: string) => void;
  completeLab: (labId: string) => void;
  updateName: (name: string) => void;
  updateAvatar: (avatarId: string) => void;
  lastAward: string | null;
  dismissAward: () => void;
  resetProgress: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Star Cadet',
  avatar: 'fox',
  xp: 120,
  level: 1,
  badges: ['badge_gravity'],
  completedLabs: [],
  solvedChallenges: 0,
  streak: 3
};

const STORAGE_KEY = 'wonderlab_profile_v1';

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_PROFILE;
  });

  const [lastAward, setLastAward] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  const addXp = (amount: number, reason?: string) => {
    setProfile(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        sound.play('fanfare');
        fireStarBurst();
        setLastAward(`🎉 Level Up! You reached Level ${newLevel}!`);
      } else if (reason) {
        sound.play('success');
        setLastAward(`+${amount} XP: ${reason}`);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        solvedChallenges: prev.solvedChallenges + 1
      };
    });
  };

  const unlockBadge = (badgeId: string) => {
    setProfile(prev => {
      if (prev.badges.includes(badgeId)) return prev;
      sound.play('fanfare');
      fireStarBurst();
      setLastAward(`🏆 New Badge Unlocked!`);
      return {
        ...prev,
        badges: [...prev.badges, badgeId],
        xp: prev.xp + 50
      };
    });
  };

  const completeLab = (labId: string) => {
    setProfile(prev => {
      if (prev.completedLabs.includes(labId)) return prev;
      return {
        ...prev,
        completedLabs: [...prev.completedLabs, labId],
        xp: prev.xp + 25
      };
    });
  };

  const updateName = (name: string) => {
    setProfile(prev => ({ ...prev, name }));
  };

  const updateAvatar = (avatar: string) => {
    setProfile(prev => ({ ...prev, avatar }));
    sound.play('pop');
  };

  const dismissAward = () => {
    setLastAward(null);
  };

  const resetProgress = () => {
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        addXp,
        unlockBadge,
        completeLab,
        updateName,
        updateAvatar,
        lastAward,
        dismissAward,
        resetProgress
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
