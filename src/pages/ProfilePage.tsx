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
import { Sword, Shield, Skull, Map, Check, Coins } from 'lucide-react';

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

  const difficultyColors: Record<string, string> = {
    Easy: 'text-[#51cf66]',
    Medium: 'text-[#ffd43b]',
    Hard: 'text-[#ff8787]',
    Extreme: 'text-[#ff6b6b]',
  };

  if (status === 'loading') {
    return <div className="p-10 text-center text-[#e4e6eb]">Loading profile data...</div>;
  }

  if (status === 'failed') {
    return <div className="p-10 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-[#00d4ff]">Player Profile</h1>
        <div className="bg-[#ffd43b]/10 border border-[#ffd43b]/30 px-4 py-2 rounded-xl flex items-center gap-2">
          <Coins className="w-5 h-5 text-[#ffd43b]" />
          <div>
            <div className="text-[10px] uppercase font-bold text-[#ffd43b]/60 leading-none mb-1">Available Coins</div>
            <div className="text-xl font-mono font-black text-[#ffd43b]">{wallet}</div>
          </div>
        </div>
      </div>

      {/* Weapons Section */}
      <div className="bg-[#1a1d26] border border-[#2a2d36] rounded-lg overflow-hidden">
        <div className="bg-[#0e1117] border-b border-[#2a2d36] px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <Sword className="w-5 h-5 text-[#00d4ff]" />
            <h2 className="text-[#00d4ff]">Available Weapons</h2>
          </div>
        </div>
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {weapons.map((weapon) => {
              const affordable = weapon.owned || wallet >= (weapon.cost || 0);
              return (
                <div
                  key={weapon.id}
                  className={`flex items-center justify-between p-3 md:p-4 rounded-lg border transition-colors cursor-pointer ${weapon.owned
                    ? 'bg-[#00d4ff]/5 border-[#00d4ff]/30'
                    : affordable
                      ? 'bg-[#0e1117] border-[#2a2d36] opacity-90'
                      : 'bg-[#0e1117] border-red-900/30 opacity-40 grayscale cursor-not-allowed'
                    }`}
                  onClick={() => affordable && dispatch(toggleWeapon(weapon.id))}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${weapon.owned ? 'bg-[#00d4ff]/10' : 'bg-[#2a2d36]'
                        }`}
                    >
                      <Sword
                        className={`w-5 h-5 ${weapon.owned ? 'text-[#00d4ff]' : 'text-[#a0a3ab]'}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[#e4e6eb] font-bold truncate">{weapon.name}</div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <div className="text-xs text-[#a0a3ab] font-mono truncate">
                          {weapon.type} • DPS: <span className="text-primary font-bold">{weapon.damage.toFixed(1)}</span>
                        </div>
                        {!weapon.owned && (
                          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${affordable
                            ? 'bg-[#ffd43b]/10 text-[#ffd43b] border-[#ffd43b]/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                            <Coins className="w-2.5 h-2.5" />
                            {weapon.cost}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {weapon.owned && (
                    <div className="w-6 h-6 bg-[#00d4ff] rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                      <Check className="w-4 h-4 text-[#0e1117]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-[#1a1d26] border border-[#2a2d36] rounded-lg overflow-hidden">
        <div className="bg-[#0e1117] border-b border-[#2a2d36] px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#00d4ff]" />
            <h2 className="text-[#00d4ff]">Skills</h2>
          </div>
        </div>
        <div className="p-4 md:p-6">
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-[#0e1117] border border-[#2a2d36] rounded-lg p-3 md:p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-[#e4e6eb] font-medium">{skill.name}</div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs md:text-sm text-[#a0a3ab]">
                        Level {skill.level}/{skill.maxLevel}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dispatch(updateSkillLevel({ id: skill.id, delta: -1 }))}
                      disabled={skill.level === 0}
                      className="w-8 h-8 md:w-10 md:h-10 bg-[#2a2d36] hover:bg-[#3a3d46] disabled:opacity-30 disabled:cursor-not-allowed rounded flex items-center justify-center transition-colors touch-manipulation"
                    >
                      -
                    </button>
                    <button
                      onClick={() => dispatch(updateSkillLevel({ id: skill.id, delta: 1 }))}
                      disabled={skill.level === skill.maxLevel}
                      className="w-8 h-8 md:w-10 md:h-10 bg-[#2a2d36] hover:bg-[#3a3d46] disabled:opacity-30 disabled:cursor-not-allowed rounded flex items-center justify-center transition-colors touch-manipulation"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="w-full bg-[#2a2d36] rounded-full h-2">
                  <div
                    className="bg-[#00d4ff] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bosses Section */}
      <div className="bg-[#1a1d26] border border-[#2a2d36] rounded-lg overflow-hidden">
        <div className="bg-[#0e1117] border-b border-[#2a2d36] px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <Skull className="w-5 h-5 text-[#00d4ff]" />
            <h2 className="text-[#00d4ff]">Bosses Defeated</h2>
          </div>
        </div>
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bosses.map((boss) => (
              <div
                key={boss.id}
                className={`flex items-center justify-between p-3 md:p-4 rounded-lg border transition-colors cursor-pointer ${boss.defeated
                  ? 'bg-[#51cf66]/5 border-[#51cf66]/30'
                  : 'bg-[#0e1117] border-[#2a2d36]'
                  }`}
                onClick={() => dispatch(toggleBoss(boss.id))}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${boss.defeated ? 'bg-[#51cf66]/10' : 'bg-[#ff6b6b]/10'
                      }`}
                  >
                    <Skull
                      className={`w-5 h-5 ${boss.defeated ? 'text-[#51cf66]' : 'text-[#ff6b6b]'}`}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[#e4e6eb] truncate">{boss.name}</div>
                    <div className={`text-sm ${difficultyColors[boss.difficulty]}`}>
                      {boss.difficulty}
                    </div>
                  </div>
                </div>
                {boss.defeated && (
                  <div className="w-6 h-6 bg-[#51cf66] rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                    <Check className="w-4 h-4 text-[#0e1117]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Levels Section */}
      <div className="bg-[#1a1d26] border border-[#2a2d36] rounded-lg overflow-hidden">
        <div className="bg-[#0e1117] border-b border-[#2a2d36] px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <Map className="w-5 h-5 text-[#00d4ff]" />
            <h2 className="text-[#00d4ff]">Level Status</h2>
          </div>
        </div>
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {levels.map((level) => (
              <div
                key={level.id}
                className={`p-3 md:p-4 rounded-lg border transition-colors cursor-pointer ${level.status === 'completed'
                  ? 'bg-[#51cf66]/5 border-[#51cf66]/30'
                  : level.status === 'available'
                    ? 'bg-[#ffd43b]/5 border-[#ffd43b]/30'
                    : 'bg-[#0e1117] border-[#2a2d36] opacity-60'
                  }`}
                onClick={() => dispatch(cycleLevelStatus(level.id))}
              >
                <div className="text-[#e4e6eb] mb-2 font-medium truncate">{level.name}</div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${level.status === 'completed'
                      ? 'bg-[#51cf66]'
                      : level.status === 'available'
                        ? 'bg-[#ffd43b]'
                        : 'bg-[#a0a3ab]'
                      }`}
                  />
                  <span className="text-sm text-[#a0a3ab] capitalize">{level.status}</span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[#2a2d36]">
                  <div className="flex items-center gap-2 text-xs text-[#ffd43b]">
                    <Coins className="w-3.5 h-3.5" />
                    <span>
                      {level.coinsCollected || 0}/{level.totalCoins || 5} Coins
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(updateLevelCoins({ id: level.id, delta: -1 }));
                      }}
                      className="w-6 h-6 bg-[#2a2d36] hover:bg-[#3a3d46] rounded flex items-center justify-center transition-colors text-xs text-[#e4e6eb]"
                    >
                      -
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(updateLevelCoins({ id: level.id, delta: 1 }));
                      }}
                      className="w-6 h-6 bg-[#2a2d36] hover:bg-[#3a3d46] rounded flex items-center justify-center transition-colors text-xs text-[#e4e6eb]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
