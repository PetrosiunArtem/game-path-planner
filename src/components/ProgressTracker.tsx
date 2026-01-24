import React, { useState } from 'react';
import { CheckCircle2, Calendar, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ProgressItem {
  id: string;
  type: 'weapon' | 'boss' | 'level' | 'achievement';
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

export const ProgressTracker: React.FC = () => {
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([
    {
      id: '1',
      type: 'level',
      title: 'Completed "Forest Follies" Run & Gun',
      description: 'Collected all 5 gold coins in the level',
      date: '2025-12-01',
      completed: true,
    },
    {
      id: '2',
      type: 'weapon',
      title: 'Purchased Spread Shot',
      description: "Acquired from Porkrind's Emporium",
      date: '2025-11-28',
      completed: true,
    },
    {
      id: '3',
      type: 'boss',
      title: 'Defeated The Root Pack',
      description: 'Knockout! A Brawl is surely brewing!',
      date: '2025-11-25',
      completed: true,
    },
    {
      id: '4',
      type: 'level',
      title: 'Unlock Inkwell Isle II',
      description: 'Defeat all bosses in Isle I to proceed',
      date: '2025-12-02',
      completed: false,
    },
  ]);

  const toggleItem = (id: string) => {
    setProgressItems(
      progressItems.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = progressItems.filter((item) => item.completed).length;
  const completionRate = Math.round((completedCount / progressItems.length) * 100);

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Tracked', value: progressItems.length, color: 'text-foreground' },
          { label: 'Completed', value: completedCount, color: 'text-green-400' },
          { label: 'Completion Rate', value: `${completionRate}%`, color: 'text-primary' },
          {
            label: 'Pending',
            value: progressItems.length - completedCount,
            color: 'text-yellow-400',
          },
        ].map((s, i) => (
          <Card key={i} className="bg-card/40 border-border/50 p-6 rounded-2xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
              {s.label}
            </div>
            <div className={cn('text-3xl font-mono font-bold', s.color)}>{s.value}</div>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3">
            <Calendar className="w-4 h-4 text-primary" /> Operational log
          </h3>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-border hover:bg-primary hover:text-white transition-all"
          >
            <Plus className="w-4 h-4 mr-2" /> Log Entry
          </Button>
        </div>

        <div className="space-y-3">
          {progressItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div
                className={cn(
                  'group relative p-5 rounded-2xl border transition-all cursor-pointer',
                  item.completed
                    ? 'bg-accent/5 border-border/20 opacity-60'
                    : 'bg-card border-border/60 hover:border-primary/40 shadow-sm'
                )}
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-center gap-6">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                      item.completed
                        ? 'bg-primary border-primary text-white'
                        : 'border-border group-hover:border-primary/50'
                    )}
                  >
                    {item.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono font-bold uppercase py-0.5 px-2 rounded bg-accent/20 text-muted-foreground border border-border/50">
                        {item.type}
                      </span>
                      <h4
                        className={cn(
                          'text-sm font-bold tracking-tight',
                          item.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                        )}
                      >
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <div className="hidden sm:block text-[10px] font-mono font-bold text-muted-foreground opacity-40">
                    {item.date}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper for cn in case it is needed locally but it is already imported from @/lib/utils
import { cn } from '@/lib/utils';
