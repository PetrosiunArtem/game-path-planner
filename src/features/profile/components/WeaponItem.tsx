import React from 'react';
import { Sword, Check, Coins } from 'lucide-react';
import { Weapon } from '../../../api/api';
import styles from './WeaponItem.module.css';

interface WeaponItemProps {
    weapon: Weapon;
    wallet: number;
    onToggle: (id: string) => void;
}

export const WeaponItem: React.FC<WeaponItemProps> = ({ weapon, wallet, onToggle }) => {
    const affordable = weapon.owned || wallet >= (weapon.cost || 0);

    const cardClassName = `
    ${styles.card} 
    ${weapon.owned ? styles.owned : affordable ? styles.affordable : styles.locked}
  `.trim();

    return (
        <div
            className={cardClassName}
            onClick={() => affordable && onToggle(weapon.id)}
        >
            <div className="flex items-center gap-3 min-w-0">
                <div
                    className={`${styles.iconWrapper} ${weapon.owned ? styles.iconOwned : styles.iconLocked}`}
                >
                    <Sword
                        className={`w-5 h-5 ${weapon.owned ? 'text-[#00d4ff]' : 'text-[#a0a3ab]'}`}
                    />
                </div>
                <div className="min-w-0">
                    <div className="text-[#e4e6eb] font-bold truncate">{weapon.name}</div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <div className="text-xs text-[#a0a3ab] font-mono truncate">
                            {weapon.type} • DPS: <span className="text-[#00d4ff] font-bold">{weapon.damage.toFixed(1)}</span>
                        </div>
                        {!weapon.owned && (
                            <div className={`
                ${styles.costBadge} 
                ${affordable ? styles.costAffordable : styles.costExpensive}
              `}>
                                <Coins className="w-2.5 h-2.5" />
                                {weapon.cost}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {weapon.owned && (
                <div className={styles.checkmark}>
                    <Check className="w-4 h-4 text-[#0e1117]" />
                </div>
            )}
        </div>
    );
};
