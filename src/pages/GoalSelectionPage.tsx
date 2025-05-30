import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Leaf, Users } from 'lucide-react';

const goals = [
  {
    id: 'restore-nature',
    title: 'Restore Nature',
    description: 'Goal description...',
    themeColor: 'bg-dream-primary',
    icon: <Leaf className="w-8 h-8" />,
    worldPhilosophy: 'Nature will return if given space...',
  },
  {
    id: 'rebuild-community',
    title: 'Rebuild Community Trust',
    description: 'Goal description...',
    themeColor: 'bg-dream-secondary',
    icon: <Users className="w-8 h-8" />,
    worldPhilosophy: 'Trust grows through shared experiences...',
  },
];

export default function GoalSelectionPage() {
  const navigate = useNavigate();

  const handleSelectGoal = (goalId: string) => {
    // In a real app, this would set the goal in PlayerProfile
    navigate('/map');
  };

  return (
    <div className="min-h-screen bg-dream-bg p-8 font-interface">
      <header className="max-w-4xl mx-auto mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Target className="w-8 h-8 text-dream-primary" />
          <h1 className="text-4xl font-narrative">Choose Your Life Goal</h1>
        </div>
        <p className="text-gray-600">Select a path that resonates with your vision for restoration</p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => handleSelectGoal(goal.id)}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition text-left group"
            >
              <div className="flex items-start gap-4">
                <div className={`${goal.themeColor} p-3 rounded-lg text-white`}>
                  {goal.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-narrative mb-2 group-hover:text-dream-primary transition">
                    {goal.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{goal.description}</p>
                  <p className="text-sm text-gray-500 italic">{goal.worldPhilosophy}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}