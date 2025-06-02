import React from 'react';
import { Book, Wrench, Bot, Sparkles, Target } from 'lucide-react';
import { useGameData } from '../hooks/useGameData';
import { usePlayerState } from '../hooks/usePlayerState';

export default function UserProfilePage() {
  const { playerState } = usePlayerState();
  const { currentWorld, currentGoal } = useGameData(playerState.selectedGoalId || undefined);

  // Calculate harmony progress per goal
  const calculateHarmonyProgress = () => {
    if (!currentWorld || !currentGoal) return { progress: 0, earned: 0, total: 0 };

    // Get all zones for the current goal
    const allZones = currentWorld.zones;
    
    // Calculate total possible harmony points from missions and events
    const totalHarmonyPossible = allZones.reduce((total, zone) => {
      // Get mission harmony rewards
      const missionHarmony = zone.missions.reduce((sum, missionId) => {
        const mission = currentWorld.missions.find(m => m.id === missionId);
        return sum + (mission?.harmonyReward || 0);
      }, 0);

      // Get event harmony rewards
      const eventHarmony = zone.locations
        .filter(loc => loc.items.some(item => item.type === 'worldEvents'))
        .map(loc => {
          const eventId = loc.items.find(item => item.type === 'worldEvents')?.id;
          return currentWorld.worldEvents.find(event => event.id === eventId);
        })
        .filter((event): event is typeof currentWorld.worldEvents[0] => event !== undefined)
        .reduce((sum, event) => sum + event.harmonyReward, 0);

      return total + missionHarmony + eventHarmony;
    }, 0);

    // Calculate earned harmony points from completed missions and restored zones
    const earnedHarmony = allZones.reduce((total, zone) => {
      // Get completed mission harmony rewards
      const missionHarmony = zone.missions.reduce((sum, missionId) => {
        if (!playerState.missionsCompleted.includes(missionId)) return sum;
        const mission = currentWorld.missions.find(m => m.id === missionId);
        return sum + (mission?.harmonyReward || 0);
      }, 0);

      // Get restored event harmony rewards
      const eventHarmony = zone.locations
        .filter(loc => loc.items.some(item => item.type === 'worldEvents'))
        .map(loc => {
          const eventId = loc.items.find(item => item.type === 'worldEvents')?.id;
          return currentWorld.worldEvents.find(event => event.id === eventId);
        })
        .filter((event): event is typeof currentWorld.worldEvents[0] => event !== undefined)
        .reduce((sum, event) => {
          if (!playerState.restoredEvents.includes(event.id)) return sum;
          return sum + event.harmonyReward;
        }, 0);

      return total + missionHarmony + eventHarmony;
    }, 0);

    return {
      progress: totalHarmonyPossible > 0 ? (earnedHarmony / totalHarmonyPossible) * 100 : 0,
      earned: earnedHarmony,
      total: totalHarmonyPossible
    };
  };

  const { progress, earned, total } = calculateHarmonyProgress();

  if (!currentGoal) {
    return (
      <div className="min-h-screen bg-dream-bg p-8 font-interface">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-narrative mb-4">No Goal Selected</h1>
          <p className="text-gray-600">Please select a goal to view your progress</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dream-bg p-8 font-interface">
      <header className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-8 h-8 text-dream-primary" />
          <h1 className="text-4xl font-narrative">{currentGoal.title}</h1>
        </div>
        <p className="text-gray-600">{currentGoal.description}</p>
      </header>

      <main className="max-w-5xl mx-auto space-y-8">
        {/* Harmony Summary */}
        <section className="bg-white rounded-2xl p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-dream-primary" />
            <h2 className="text-2xl font-interface">Harmony Progress</h2>
          </div>
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-harmony-high rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600">
              Current Harmony: {Math.round(progress)}%
            </p>
            <p className="text-sm text-gray-500">
              {earned} / {total} Harmony Points
            </p>
          </div>
        </section>

        {/* Skills */}
        <section className="bg-white rounded-2xl p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <Book className="w-6 h-6 text-dream-primary" />
            <h2 className="text-2xl font-interface">Learned Skills</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentWorld?.skills.filter(skill => playerState.learnedSkills.includes(skill.id)).map(skill => (
              <div key={skill.id} className="flex items-center gap-3 p-4 bg-dream-zone-bg rounded-lg">
                <span className="text-2xl">{skill.icon}</span>
                <span className="font-interface">{skill.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section className="bg-white rounded-2xl p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <Wrench className="w-6 h-6 text-dream-primary" />
            <h2 className="text-2xl font-interface">Acquired Tools</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentWorld?.tools.filter(tool => playerState.acquiredTools.includes(tool.id)).map(tool => (
              <div key={tool.id} className="flex items-center gap-3 p-4 bg-dream-zone-bg rounded-lg">
                <span className="text-2xl">{tool.icon}</span>
                <span className="font-interface">{tool.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* AI Nodes */}
        <section className="bg-white rounded-2xl p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <Bot className="w-6 h-6 text-dream-primary" />
            <h2 className="text-2xl font-interface">AI Node Partners</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentWorld?.aiNodes.filter(node => playerState.inventoryNodes.includes(node.id)).map(node => (
              <div key={node.id} className="flex items-center gap-3 p-4 bg-dream-zone-bg rounded-lg">
                <span className="text-2xl">{node.icon}</span>
                <div>
                  <div className="font-interface">{node.name}</div>
                  <div className="text-sm text-gray-600">{node.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}