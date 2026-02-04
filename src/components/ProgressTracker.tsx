import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchLogs, addLogEntry, toggleLogStatus } from '../features/progress/progressSlice';
import { CheckCircle2, Calendar, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export const ProgressTracker: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.progress);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'level' as 'level' | 'weapon' | 'boss' | 'achievement',
    title: '',
    description: '',
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLogs());
    }
  }, [dispatch, status]);

  const handleToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(toggleLogStatus(id));
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAddEntry = async () => {
    if (formData.title) {
      await dispatch(addLogEntry({
        ...formData,
        completed: false
      }));
      setFormData({ type: 'level', title: '', description: '' });
      setIsDialogOpen(false);
    }
  };

  const completedCount = items.filter((item) => item.completed).length;
  const completionRate = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Tracked', value: items.length, color: 'text-foreground' },
          { label: 'Completed', value: completedCount, color: 'text-green-400' },
          { label: 'Completion Rate', value: `${completionRate}%`, color: 'text-primary' },
          {
            label: 'Pending',
            value: items.length - completedCount,
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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full border-border hover:bg-primary hover:text-white transition-all"
              >
                <Plus className="w-4 h-4 mr-2" /> Log Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1d26] border-border/60">
              <DialogHeader>
                <DialogTitle>Add New Operational Log</DialogTitle>
                <DialogDescription>
                  Record your achievements or upcoming tasks.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Type</label>
                  <Select
                    value={formData.type}
                    onValueChange={(v: any) => setFormData({ ...formData, type: v })}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="level">Level</SelectItem>
                      <SelectItem value="boss">Boss</SelectItem>
                      <SelectItem value="weapon">Weapon</SelectItem>
                      <SelectItem value="achievement">Achievement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Log Title</label>
                  <Input
                    placeholder='e.g. Defeated Dr. Kahls Robot'
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Brief Detail</label>
                  <Input
                    placeholder='Describe the milestone...'
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-background"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddEntry} className="w-full sm:w-auto">Confirm Entry</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div
                  className={cn(
                    'group relative rounded-2xl border transition-all cursor-pointer overflow-hidden',
                    item.completed
                      ? 'bg-accent/5 border-border/20 opacity-70'
                      : 'bg-card border-border/60 hover:border-primary/40 shadow-sm'
                  )}
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-6">
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
                          item.completed
                            ? 'bg-primary border-primary text-white'
                            : 'border-border group-hover:border-primary/50'
                        )}
                        onClick={(e) => handleToggle(e, item.id)}
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
                              'text-sm font-bold tracking-tight transition-all',
                              item.completed ? 'text-muted-foreground line-through' : 'text-foreground',
                              expandedId === item.id ? 'text-primary' : ''
                            )}
                          >
                            {item.title}
                          </h4>
                        </div>
                      </div>

                      <div className="hidden sm:block text-[10px] font-mono font-bold text-muted-foreground opacity-40">
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedId === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-12 pt-4 border-t border-border/20">
                            <p className="text-secondary text-sm font-medium leading-relaxed italic">
                              {item.description || 'No additional details provided for this entry.'}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
