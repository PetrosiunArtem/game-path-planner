import React from 'react';
import { Skill } from '../../../api/api';

interface SkillItemProps {
    skill: Skill;
    onUpdateLevel: (id: string, delta: number) => void;
}

export const SkillItem: React.FC<SkillItemProps> = ({ skill, onUpdateLevel }) => {
    const progressPercent = (skill.level / skill.maxLevel) * 100;

    return (
        <div className="bg-[#0e1117] border border-[#2a2d36] rounded-lg p-3 md:p-4 transition-all hover:border-primary/30">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <div className="text-[#e4e6eb] font-medium">{skill.name}</div>
                    <div className="text-xs md:text-sm text-[#a0a3ab]">
                        Level {skill.level}/{skill.maxLevel}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onUpdateLevel(skill.id, -1)}
                        disabled={skill.level === 0}
                        className="w-8 h-8 md:w-10 md:h-10 bg-[#2a2d36] hover:bg-[#3a3d46] disabled:opacity-30 disabled:cursor-not-allowed rounded flex items-center justify-center transition-colors touch-manipulation font-bold text-[#e4e6eb]"
                    >
                        -
                    </button>
                    <button
                        onClick={() => onUpdateLevel(skill.id, 1)}
                        disabled={skill.level === skill.maxLevel}
                        className="w-8 h-8 md:w-10 md:h-10 bg-[#2a2d36] hover:bg-[#3a3d46] disabled:opacity-30 disabled:cursor-not-allowed rounded flex items-center justify-center transition-colors touch-manipulation font-bold text-[#e4e6eb]"
                    >
                        +
                    </button>
                </div>
            </div>
            <div className="w-full bg-[#2a2d36] rounded-full h-2 overflow-hidden">
                <div
                    className="bg-[#00d4ff] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>
    );
};
