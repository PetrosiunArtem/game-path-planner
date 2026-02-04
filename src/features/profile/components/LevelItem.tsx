import React from 'react';
import { Coins } from 'lucide-react';
import { Level } from '../../../api/api';

interface LevelItemProps {
    level: Level;
    onCycleStatus: (id: string) => void;
    onUpdateCoins: (id: string, delta: number) => void;
}

export const LevelItem: React.FC<LevelItemProps> = ({ level, onCycleStatus, onUpdateCoins }) => {
    const statusColor = level.status === 'completed'
        ? 'bg-[#51cf66]'
        : level.status === 'available'
            ? 'bg-[#ffd43b]'
            : 'bg-[#a0a3ab]';

    return (
        <div
            className={`p-3 md:p-4 rounded-lg border transition-all cursor-pointer group ${level.status === 'completed' ? 'bg-[#51cf66]/5 border-[#51cf66]/30' :
                level.status === 'available' ? 'bg-[#ffd43b]/5 border-[#ffd43b]/30' :
                    'bg-[#0e1117] border-[#2a2d36] opacity-60'
                }`}
            onClick={() => onCycleStatus(level.id)}
        >
            <div className="text-[#e4e6eb] mb-2 font-bold truncate group-hover:text-primary transition-colors">{level.name}</div>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                <span className="text-sm text-[#a0a3ab] capitalize font-medium">{level.status}</span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[#2a2d36]">
                <div className="flex items-center gap-2 text-xs text-[#ffd43b] font-mono">
                    <Coins className="w-3.5 h-3.5" />
                    <span>
                        {level.coinsCollected || 0}/{level.totalCoins || 5}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onUpdateCoins(level.id, -1);
                        }}
                        className="w-6 h-6 bg-[#2a2d36] hover:bg-[#3a3d46] rounded flex items-center justify-center transition-colors text-xs text-[#e4e6eb] font-bold"
                    >
                        -
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onUpdateCoins(level.id, 1);
                        }}
                        className="w-6 h-6 bg-[#2a2d36] hover:bg-[#3a3d46] rounded flex items-center justify-center transition-colors text-xs text-[#e4e6eb] font-bold"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};
