import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface StrategyAdvisorProps {
  advice: string;
  label: string;
  score: number;
  factors?: { factor: string; impact: number; type: 'positive' | 'negative' }[];
}

export const StrategyAdvisor: React.FC<StrategyAdvisorProps> = ({ advice, label, score, factors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-6 flex flex-col gap-4"
    >
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/20 p-2.5 rounded-xl">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tactical Assessment:</span>
                <span
                  className={`text-xs font-black uppercase tracking-widest ${score > 0.7
                    ? 'text-green-400'
                    : score > 0.4
                      ? 'text-yellow-400'
                      : 'text-red-400'
                    }`}
                >
                  {label}
                </span>
              </div>
              <p className="text-secondary text-base font-medium italic leading-relaxed border-l-2 border-primary/20 pl-4 py-1">
                "{advice}"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {factors && factors.length > 0 && (
        <Card className="bg-accent/5 border-border/40 overflow-hidden">
          <div className="bg-accent/10 px-4 py-2 border-b border-border/40 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Impact Attribution</span>
          </div>
          <CardContent className="p-4 space-y-3">
            {factors.map((f, i) => (
              <div key={i} className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-muted-foreground">{f.factor}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${f.type === 'positive' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={f.type === 'positive' ? 'text-green-400' : 'text-red-400'}>
                    {f.type === 'positive' ? '+' : ''}{(f.impact * 100).toFixed(1)}% influence
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}


    </motion.div>
  );
};
