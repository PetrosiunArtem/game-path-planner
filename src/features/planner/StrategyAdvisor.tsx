import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface StrategyAdvisorProps {
  advice: string;
  label: string;
  score: number;
}

export const StrategyAdvisor: React.FC<StrategyAdvisorProps> = ({ advice, label, score }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-6"
    >
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="bg-primary/20 p-2 rounded-full">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">AI Strategy Rating:</span>
                <span
                  className={`text-sm font-bold uppercase tracking-wider ${
                    score > 0.7
                      ? 'text-green-400'
                      : score > 0.4
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }`}
                >
                  {label}
                </span>
              </div>
              <p className="text-secondary text-sm italic leading-relaxed">"{advice}"</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest bg-background/50 p-2 rounded">
            <Info className="w-3 h-3" />
            Analysis based on loadout synergy and boss attack vectors
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
