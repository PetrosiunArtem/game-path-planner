import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchLoadouts, removeLoadout } from './loadoutSlice';
import { LoadoutForm } from './LoadoutForm';
import { Loadout } from '../../api/mockApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Zap, Shield, Crosshair } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadoutList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.loadouts);
  const [editingLoadout, setEditingLoadout] = useState<Loadout | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLoadouts());
    }
  }, [status, dispatch]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      dispatch(removeLoadout(id));
    }
  };

  const handleEdit = (loadout: Loadout) => {
    setEditingLoadout(loadout);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingLoadout(null);
    setIsFormOpen(true);
  };

  if (status === 'loading') return <div className="text-primary text-center py-10 animate-pulse">Loading arsenal data...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-4">
        <div>
            <h2 className="text-2xl font-bold text-foreground">Wallop Equipment</h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Configure your contracts and weaponry for Inkwell Isle.</p>
        </div>
        <Button onClick={handleCreate} className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" />
          New Contract
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {items.map((loadout, index) => (
            <motion.div
              key={loadout.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-card/40 backdrop-blur-sm border-border hover:border-primary/40 transition-all duration-300 h-full flex flex-col group overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {loadout.name}
                      </CardTitle>
                      <Badge variant="outline" className="font-mono text-[10px] opacity-50">#{loadout.id.slice(0, 4)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-2 flex-1">
                  <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-accent/20 border border-border/50">
                          <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-2">Shot Configuration</div>
                          <div className="text-xs font-semibold flex items-center gap-1.5 truncate">
                              <Crosshair className="w-3 h-3 text-primary shrink-0" /> {loadout.weaponPrimary}
                          </div>
                          <div className="text-xs font-semibold flex items-center gap-1.5 mt-1 truncate">
                              <Crosshair className="w-3 h-3 text-primary shrink-0" /> {loadout.weaponSecondary}
                          </div>
                      </div>
                      <div className="space-y-3">
                          <div className="p-2 px-3 rounded-lg bg-accent/20 border border-border/50">
                              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Charm</div>
                              <div className="text-xs font-semibold flex items-center gap-1.5">
                                  <Shield className="w-3 h-3 text-indigo-400" /> {loadout.charm}
                              </div>
                          </div>
                          <div className="p-2 px-3 rounded-lg bg-accent/20 border border-border/50">
                              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Super Art</div>
                              <div className="text-xs font-semibold flex items-center gap-1.5">
                                  <Zap className="w-3 h-3 text-yellow-400" /> {loadout.superMove}
                              </div>
                          </div>
                      </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/40 flex justify-end gap-2 p-4 bg-accent/5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(loadout)}
                    className="hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1.5" /> Modify
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(loadout.id, loadout.name)}
                    className="hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Scrap
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {isFormOpen && (
        <LoadoutForm
          existingLoadout={editingLoadout || undefined}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};
