import React from 'react';
import { PathPlanner } from '../features/planner/PathPlanner';

const PlannerPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-surface border border-border rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-primary mb-2 font-display">Tactical Planner</h1>
        <p className="text-secondary">Select a target and receive intelligence.</p>
      </div>
      <PathPlanner />
    </div>
  );
};

export default PlannerPage;
