import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { calculateBossPath } from './plannerSlice';
import { fetchLoadouts } from '../loadouts/loadoutSlice';
import { fetchProfile } from '../profile/profileSlice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, Target } from 'lucide-react';
import { StrategyAdvisor } from './StrategyAdvisor';
import { motion, AnimatePresence } from 'framer-motion';


export const PathPlanner: React.FC = () => {
  const dispatch = useAppDispatch();
  const plannerState = useAppSelector((state) => state.planner);
  const loadoutsState = useAppSelector((state) => state.loadouts);
  const profileState = useAppSelector((state) => state.profile);

  const [selectedBoss, setSelectedBoss] = useState('');
  const [selectedLoadoutId, setSelectedLoadoutId] = useState('');

  useEffect(() => {
    if (loadoutsState.status === 'idle') {
      dispatch(fetchLoadouts());
    }
    if (profileState.status === 'idle') {
      dispatch(fetchProfile());
    }
  }, [dispatch, loadoutsState.status, profileState.status]);

  useEffect(() => {
    if (profileState.bosses.length > 0 && !selectedBoss) {
      setSelectedBoss(profileState.bosses[0].name);
    }
  }, [profileState.bosses, selectedBoss]);

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Hard': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Extreme': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-1000">
      <Card className="bg-card/50 backdrop-blur-xl border-border shadow-xl rounded-3xl">
        <div className="bg-gradient-to-r from-primary/10 via-transparent to-transparent p-8 border-b border-border/50">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Contract Analysis Board
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1 font-medium italic">
            Advanced probability simulation for Inkwell Isle boss encounters.
          </CardDescription>
        </div>
        <CardContent className="p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-primary/80 ml-1">
                Target Debtor
              </label>
              <Select value={selectedBoss} onValueChange={setSelectedBoss}>
                <SelectTrigger className="bg-background border-border h-16 rounded-2xl focus:ring-primary/20 transition-all px-5 shadow-inner">
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Target Selected</span>
                    <SelectValue placeholder="Identify Boss" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#1a1d26] border-border/50 rounded-2xl max-h-80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100]">
                  {profileState.bosses.length > 0 ? (
                    profileState.bosses.map((boss) => (
                      <SelectItem
                        key={boss.id}
                        value={boss.name}
                        className="rounded-xl focus:bg-primary/10 focus:text-primary transition-all py-4 px-4 my-1 mx-1 border border-transparent focus:border-primary/20"
                      >
                        <div className="flex items-center justify-between w-full gap-8">
                          <span className="font-bold text-base">{boss.name}</span>
                          <Badge
                            variant="outline"
                            className={`text-[9px] uppercase font-black px-2.5 py-0.5 border-2 ${getDifficultyColor(boss.difficulty)}`}
                          >
                            {boss.difficulty}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Gathering Intel...</span>
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-primary/80 ml-1">
                Combat Loadout
              </label>
              <Select value={selectedLoadoutId} onValueChange={setSelectedLoadoutId}>
                <SelectTrigger className="bg-background border-border h-16 rounded-2xl focus:ring-primary/20 transition-all px-5 shadow-inner text-left">
                  <div className="flex flex-col items-start gap-0.5 overflow-hidden">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider text-left">Active Loadout</span>
                    <div className="truncate w-full font-bold">
                      {loadoutsState.items.find(l => l.id === selectedLoadoutId)?.name || 'Resource Selection'}
                    </div>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#1a1d26] border-border/50 rounded-2xl max-h-80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100]">
                  {loadoutsState.items.map((l) => (
                    <SelectItem
                      key={l.id}
                      value={l.id}
                      className="rounded-xl focus:bg-primary/10 focus:text-primary transition-all py-3 px-4 my-1 mx-1 border border-transparent focus:border-primary/20"
                    >
                      <div className="flex flex-col gap-1.5">
                        <span className="font-black text-base tracking-tight">{l.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold uppercase">
                            {l.weaponPrimary}
                          </span>
                          <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-tighter">
                            {l.charm}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
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
              <span className="flex items-center gap-2">
                <Target className="w-5 h-5" /> Initialize Battle Simulation
              </span>
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
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <Card className="bg-card/30 backdrop-blur-md border-border/60 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-border/40 p-8 pb-6 bg-accent/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="pt-2">
                    <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                      {plannerState.currentResult.goalName}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-4 bg-background/80 border border-border p-4 rounded-2xl shadow-sm">
                    <div className="text-right">
                      <div className="text-2xl font-mono font-bold text-primary leading-none">
                        ~{plannerState.currentResult.estimatedTimeMinutes}m
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">
                        Sim. Time
                      </div>
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
                          <p className="text-sm text-foreground/80 font-medium leading-relaxed pt-1.5">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-accent/10 border border-border/50 p-8 rounded-2xl relative">
                    <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 text-center">
                      Probability of Success
                    </h4>

                    <div className="flex items-end justify-center gap-2 mb-4">
                      <span className="text-5xl font-mono font-extrabold text-foreground leading-none">
                        {Math.max(10, 100 - plannerState.currentResult.attemptsEstimation * 10)}
                      </span>
                      <span className="text-xl font-bold text-muted-foreground mb-1">%</span>
                    </div>

                    <div className="h-2 w-full bg-accent/30 rounded-full overflow-hidden mb-6">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.max(10, 100 - plannerState.currentResult.attemptsEstimation * 10)}%`,
                        }}
                        className="h-full bg-primary"
                      />
                    </div>

                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-none">
                        Est. Iterations
                      </span>
                      <Badge variant="outline" className="font-mono text-primary border-primary/20">
                        {plannerState.currentResult.attemptsEstimation} Cycles
                      </Badge>
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
