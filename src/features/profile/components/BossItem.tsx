import React from 'react';
import { Skull, Check } from 'lucide-react';
import { Boss } from '../../../api/api';

interface BossItemProps {
    boss: Boss;
    onToggle: (id: string) => void;
}

const difficultyColors: Record<string, string> = {
    Easy: 'text-[#51cf66]',
    Medium: 'text-[#ffd43b]',
    Hard: 'text-[#ff8787]',
    Extreme: 'text-[#ff6b6b]',
};

export const BossItem: React.FC<BossItemProps> = ({ boss, onToggle }) => {
    return (
        <div
            className={`flex items-center justify-between p-3 md:p-4 rounded-lg border transition-all cursor-pointer ${boss.defeated
                ? 'bg-[#51cf66]/5 border-[#51cf66]/30'
                : 'bg-[#0e1117] border-[#2a2d36] hover:border-[#00d4ff]/30'
                }`}
            onClick={() => onToggle(boss.id)}
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
                    <div className="text-[#e4e6eb] truncate font-medium">{boss.name}</div>
                    <div className={`text-sm font-bold ${difficultyColors[boss.difficulty] || 'text-[#a0a3ab]'}`}>
                        {boss.difficulty}
                    </div>
                </div>
            </div>
            {boss.defeated && (
                <div className="w-6 h-6 bg-[#51cf66] rounded-full flex items-center justify-center flex-shrink-0 ml-2 shadow-lg shadow-[#51cf66]/20">
                    <Check className="w-4 h-4 text-[#0e1117]" />
                </div>
            )}
        </div>
    );
};
