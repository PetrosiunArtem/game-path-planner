import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchProfile,
  toggleWeapon,
  updateSkillLevel,
  toggleBoss,
  cycleLevelStatus,
  updateLevelCoins,
  selectWallet,
} from '../features/profile/profileSlice';
import { Sword, Shield, Skull, Map, Coins } from 'lucide-react';
import { WeaponItem } from '../features/profile/components/WeaponItem';
import { SkillItem } from '../features/profile/components/SkillItem';
import { BossItem } from '../features/profile/components/BossItem';
import { LevelItem } from '../features/profile/components/LevelItem';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const wallet = useAppSelector(selectWallet);
  const { weapons, skills, bosses, levels, status, error } = useAppSelector(
    (state) => state.profile
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProfile());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#e4e6eb] font-medium">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl text-center">
        <Skull className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-red-500 font-bold mb-2">Error Loading Profile</h3>
        <p className="text-red-400/80">{error}</p>
        <button
          onClick={() => dispatch(fetchProfile())}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground uppercase tracking-tight">Player Profile</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage your arsenal and track your progress across Inkwell Isle.</p>
        </div>
        <div className="bg-primary/10 border border-primary/30 px-5 py-3 rounded-2xl flex items-center gap-4 shadow-xl shadow-primary/5">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Coins className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-black text-primary/60 tracking-wider leading-none mb-1">Available Coins</div>
            <div className="text-2xl font-mono font-black text-primary tabular-nums">{wallet}</div>
          </div>
        </div>
      </header>

      <section className="bg-card/40 backdrop-blur-sm border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-accent/5 border-b border-border px-6 py-4 flex items-center gap-3">
          <Sword className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold uppercase tracking-wide">Available Weapons</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {weapons.map((weapon) => (
              <WeaponItem
                key={weapon.id}
                weapon={weapon}
                wallet={wallet}
                onToggle={(id: string) => dispatch(toggleWeapon(id))}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-card/40 backdrop-blur-sm border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-accent/5 border-b border-border px-6 py-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold uppercase tracking-wide">Skill Upgrades</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {skills.map((skill) => (
                <SkillItem
                  key={skill.id}
                  skill={skill}
                  onUpdateLevel={(id: string, delta: number) => dispatch(updateSkillLevel({ id, delta }))}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-card/40 backdrop-blur-sm border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-accent/5 border-b border-border px-6 py-4 flex items-center gap-3">
            <Skull className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold uppercase tracking-wide">Boss Progress</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bosses.map((boss) => (
                <BossItem
                  key={boss.id}
                  boss={boss}
                  onToggle={(id: string) => dispatch(toggleBoss(id))}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="bg-card/40 backdrop-blur-sm border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-accent/5 border-b border-border px-6 py-4 flex items-center gap-3">
          <Map className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold uppercase tracking-wide">World Exploration</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {levels.map((level) => (
              <LevelItem
                key={level.id}
                level={level}
                onCycleStatus={(id: string) => dispatch(cycleLevelStatus(id))}
                onUpdateCoins={(id: string, delta: number) => dispatch(updateLevelCoins({ id, delta }))}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
