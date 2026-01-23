import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { calculateBossPath } from './plannerSlice';
import { fetchLoadouts } from '../loadouts/loadoutSlice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Target } from 'lucide-react';
import { StrategyAdvisor } from './StrategyAdvisor';
import { motion, AnimatePresence } from 'framer-motion';

const BOSSES = [
  'The Root Pack', 'Goopy Le Grande', 'Ribby and Croaks', 'Hilda Berg', 'Cagney Carnation',
  'Baroness Von Bon Bon', 'Beppi The Clown', 'Djimmi The Great', 'Grim Matchstick', 'Wally Warbles'
];

export const PathPlanner: React.FC = () => {
  const dispatch = useAppDispatch();
  const plannerState = useAppSelector((state) => state.planner);
  const loadoutsState = useAppSelector((state) => state.loadouts);

  const [selectedBoss, setSelectedBoss] = useState(BOSSES[0]);
  const [selectedLoadoutId, setSelectedLoadoutId] = useState('');

  useEffect(() => {
    if (loadoutsState.status === 'idle') {
      dispatch(fetchLoadouts());
    }
  }, [dispatch, loadoutsState.status]);

  // Select first loadout by default if available
  useEffect(() => {
     if (loadoutsState.items.length > 0 && !selectedLoadoutId) {
         setSelectedLoadoutId(loadoutsState.items[0].id);
     }
  }, [loadoutsState.items, selectedLoadoutId]);

  const handleCalculate = () => {
    if (selectedBoss && selectedLoadoutId) {
      dispatch(calculateBossPath({ bossName: selectedBoss, loadoutId: selectedLoadoutId }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-1000">
      <Card className="bg-card/50 backdrop-blur-xl border-border shadow-xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-transparent to-transparent p-8 border-b border-border/50">
          <CardTitle className="text-2xl font-bold tracking-tight">Contract Analysis Board</CardTitle>
          <CardDescription className="text-muted-foreground mt-1 font-medium italic">Advanced probability simulation for Inkwell Isle boss encounters.</CardDescription>
        </div>
        <CardContent className="p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Target Debtor</label>
              <Select value={selectedBoss} onValueChange={setSelectedBoss}>
                <SelectTrigger className="bg-background/50 border-border h-12 rounded-xl focus:ring-primary/20 transition-all">
                  <SelectValue placeholder="Identify Boss" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border rounded-xl">
                  {BOSSES.map(b => <SelectItem key={b} value={b} className="rounded-lg focus:bg-primary/10 focus:text-primary transition-colors">{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Combat Loadout</label>
              <Select value={selectedLoadoutId} onValueChange={setSelectedLoadoutId}>
                <SelectTrigger className="bg-background/50 border-border h-12 rounded-xl focus:ring-primary/20 transition-all">
                  <SelectValue placeholder="Resource Selection" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border rounded-xl">
                  {loadoutsState.items.map(l => (
                    <SelectItem key={l.id} value={l.id} className="rounded-lg focus:bg-primary/10 focus:text-primary transition-colors">{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleCalculate}
            disabled={!selectedLoadoutId || plannerState.status === 'loading'}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-16 text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          >
            {plannerState.status === 'loading' ? (
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Studying Attack Patterns...
                </div>
            ) : (
                <span className="flex items-center gap-2"><Target className="w-5 h-5"/> Initialize Battle Simulation</span>
            )}
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {plannerState.currentResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <Card className="bg-card/30 backdrop-blur-md border-border/60 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-border/40 p-8 pb-6 bg-accent/5">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                     <div>
                         <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-tighter">Live Intelligence</Badge>
                            <span className="text-[10px] font-mono text-muted-foreground uppercase">{new Date().toISOString()}</span>
                         </div>
                         <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                             {plannerState.currentResult.goalName}
                         </CardTitle>
                     </div>
                     <div className="flex items-center gap-4 bg-background/80 border border-border p-4 rounded-2xl shadow-sm">
                         <div className="text-right">
                             <div className="text-2xl font-mono font-bold text-primary leading-none">~{plannerState.currentResult.estimatedTimeMinutes}m</div>
                             <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Sim. Time</div>
                         </div>
                         <div className="w-px h-10 bg-border mx-2" />
                         <Clock className="w-8 h-8 text-primary/40" />
                     </div>
                 </div>
              </CardHeader>

              <CardContent className="p-8 grid md:grid-cols-2 gap-12">
                 <div className="space-y-8">
                     <div>
                        <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-2">
                            Operational Vectors
                        </h4>
                        <div className="space-y-4">
                            {plannerState.currentResult.steps.map((step, idx) => (
                                <div key={idx} className="flex gap-4 group">
                                    <div className="w-8 h-8 rounded-lg bg-accent/50 border border-border/50 flex items-center justify-center text-xs font-mono font-bold text-primary transition-all group-hover:bg-primary group-hover:text-white">
                                        {(idx + 1).toString().padStart(2, '0')}
                                    </div>
                                    <p className="text-sm text-foreground/80 font-medium leading-relaxed pt-1.5">{step}</p>
                                </div>
                            ))}
                        </div>
                     </div>
                 </div>

                 <div className="space-y-8">
                    <div className="bg-accent/10 border border-border/50 p-8 rounded-2xl relative">
                        <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 text-center">Probability of Success</h4>

                        <div className="flex items-end justify-center gap-2 mb-4">
                            <span className="text-5xl font-mono font-extrabold text-foreground leading-none">
                                {Math.max(10, 100 - (plannerState.currentResult.attemptsEstimation * 10))}
                            </span>
                            <span className="text-xl font-bold text-muted-foreground mb-1">%</span>
                        </div>

                        <div className="h-2 w-full bg-accent/30 rounded-full overflow-hidden mb-6">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.max(10, 100 - (plannerState.currentResult.attemptsEstimation * 10))}%` }}
                                className="h-full bg-primary"
                            />
                        </div>

                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-none">Est. Iterations</span>
                            <Badge variant="outline" className="font-mono text-primary border-primary/20">{plannerState.currentResult.attemptsEstimation} Cycles</Badge>
                        </div>
                    </div>

                    <StrategyAdvisor
                        advice={plannerState.currentResult.aiAdvice}
                        label={plannerState.currentResult.strategyLabel}
                        score={plannerState.currentResult.efficiencyScore}
                    />
                 </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
