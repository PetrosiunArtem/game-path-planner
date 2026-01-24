import React from 'react';
import { ProgressTracker } from '../components/ProgressTracker';

const ProgressPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-lg p-6">
        <h1 className="text-2xl font-bold text-primary mb-2 font-display">Progress Tracker</h1>
        <p className="text-secondary text-sm">
          Track your achievements and contracts to plan your next move against the Devil.
        </p>
      </div>
      <ProgressTracker />
    </div>
  );
};

export default ProgressPage;
