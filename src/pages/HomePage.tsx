import React from 'react';
import { User, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-background to-background border border-primary/10 p-12">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Target className="w-64 h-64 text-primary" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors mb-6">
            v2.0 Beta
          </Badge>
          <h2 className="text-5xl font-extrabold text-foreground mb-4 tracking-tight leading-tight">
            Master your <span className="text-primary">contracts</span> with tactical precision.
          </h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed font-medium">
            The professional dashboard for traversing Inkwell Isle. Track soul contracts, simulate
            boss encounters with casino-grade odds, and optimize your loadouts.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
              asChild
            >
              <Link to="/planner">Simulate Battle</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-12 border-border"
              asChild
            >
              <Link to="/profile">Manage Arsenal</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: User,
            label: 'Wallop Setups',
            value: '1',
            color: 'text-primary',
            bg: 'bg-primary/5',
          },
          {
            icon: Target,
            label: 'Active Debtors',
            value: '10',
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/5',
          },
          {
            icon: TrendingUp,
            label: 'Contracts Collected',
            value: '0%',
            color: 'text-green-400',
            bg: 'bg-green-400/5',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="glass-card p-6 rounded-2xl border border-border/50 group hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500',
                  stat.bg
                )}
              >
                <stat.icon className={cn('w-6 h-6', stat.color)} />
              </div>
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
            <div className="text-3xl font-bold font-mono text-foreground leading-none">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
