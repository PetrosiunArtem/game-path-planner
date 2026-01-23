import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProfile, toggleWeapon, updateSkillLevel, toggleBoss, cycleLevelStatus } from '../features/profile/profileSlice';
import { Sword, Shield, Skull, Map, Check } from 'lucide-react';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { weapons, skills, bosses, levels, status, error } = useAppSelector((state) => state.profile);

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
      <h1 className="text-3xl font-bold text-[#00d4ff] mb-6">Player Profile</h1>

      {/* Weapons Section */}
      <div className="bg-[#1a1d26] border border-[#2a2d36] rounded-lg overflow-hidden">
        <div className="bg-[#0e1117] border-b border-[#2a2d36] px-6 py-4">
          <div className="flex items-center gap-3">
            <Sword className="w-5 h-5 text-[#00d4ff]" />
            <h2 className="text-[#00d4ff]">Available Weapons</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {weapons.map(weapon => (
              <div
                key={weapon.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer ${weapon.owned
                    ? 'bg-[#00d4ff]/5 border-[#00d4ff]/30'
                    : 'bg-[#0e1117] border-[#2a2d36] opacity-60'
                  }`}
                onClick={() => dispatch(toggleWeapon(weapon.id))}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${weapon.owned ? 'bg-[#00d4ff]/10' : 'bg-[#2a2d36]'
                    }`}>
                    <Sword className={`w-5 h-5 ${weapon.owned ? 'text-[#00d4ff]' : 'text-[#a0a3ab]'}`} />
                  </div>
                  <div>
                    <div className="text-[#e4e6eb]">{weapon.name}</div>
                    <div className="text-sm text-[#a0a3ab]">{weapon.type} • Damage: {weapon.damage}</div>
                  </div>
                </div>
                {weapon.owned && (
                  <div className="w-6 h-6 bg-[#00d4ff] rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#0e1117]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-[#1a1d26] border border-[#2a2d36] rounded-lg overflow-hidden">
        <div className="bg-[#0e1117] border-b border-[#2a2d36] px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#00d4ff]" />
            <h2 className="text-[#00d4ff]">Skills</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {skills.map(skill => (
              <div key={skill.id} className="bg-[#0e1117] border border-[#2a2d36] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-[#e4e6eb]">{skill.name}</div>
                    <div className="text-sm text-[#a0a3ab]">Level {skill.level}/{skill.maxLevel}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dispatch(updateSkillLevel({ id: skill.id, delta: -1 }))}
                      disabled={skill.level === 0}
                      className="w-8 h-8 bg-[#2a2d36] hover:bg-[#3a3d46] disabled:opacity-30 disabled:cursor-not-allowed rounded flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <button
                      onClick={() => dispatch(updateSkillLevel({ id: skill.id, delta: 1 }))}
                      disabled={skill.level === skill.maxLevel}
                      className="w-8 h-8 bg-[#2a2d36] hover:bg-[#3a3d46] disabled:opacity-30 disabled:cursor-not-allowed rounded flex items-center justify-center transition-colors"
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
        <div className="bg-[#0e1117] border-b border-[#2a2d36] px-6 py-4">
          <div className="flex items-center gap-3">
            <Skull className="w-5 h-5 text-[#00d4ff]" />
            <h2 className="text-[#00d4ff]">Bosses Defeated</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bosses.map(boss => (
              <div
                key={boss.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer ${boss.defeated
                    ? 'bg-[#51cf66]/5 border-[#51cf66]/30'
                    : 'bg-[#0e1117] border-[#2a2d36]'
                  }`}
                onClick={() => dispatch(toggleBoss(boss.id))}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${boss.defeated ? 'bg-[#51cf66]/10' : 'bg-[#ff6b6b]/10'
                    }`}>
                    <Skull className={`w-5 h-5 ${boss.defeated ? 'text-[#51cf66]' : 'text-[#ff6b6b]'}`} />
                  </div>
                  <div>
                    <div className="text-[#e4e6eb]">{boss.name}</div>
                    <div className={`text-sm ${difficultyColors[boss.difficulty]}`}>{boss.difficulty}</div>
                  </div>
                </div>
                {boss.defeated && (
                  <div className="w-6 h-6 bg-[#51cf66] rounded-full flex items-center justify-center">
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
        <div className="bg-[#0e1117] border-b border-[#2a2d36] px-6 py-4">
          <div className="flex items-center gap-3">
            <Map className="w-5 h-5 text-[#00d4ff]" />
            <h2 className="text-[#00d4ff]">Level Status</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {levels.map(level => (
              <div
                key={level.id}
                className={`p-4 rounded-lg border transition-colors cursor-pointer ${level.status === 'completed'
                    ? 'bg-[#51cf66]/5 border-[#51cf66]/30'
                    : level.status === 'available'
                      ? 'bg-[#ffd43b]/5 border-[#ffd43b]/30'
                      : 'bg-[#0e1117] border-[#2a2d36] opacity-60'
                  }`}
                onClick={() => dispatch(cycleLevelStatus(level.id))}
              >
                <div className="text-[#e4e6eb] mb-2">{level.name}</div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${level.status === 'completed'
                        ? 'bg-[#51cf66]'
                        : level.status === 'available'
                          ? 'bg-[#ffd43b]'
                          : 'bg-[#a0a3ab]'
                      }`}
                  />
                  <span className="text-sm text-[#a0a3ab] capitalize">
                    {level.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
