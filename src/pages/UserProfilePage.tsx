import React from 'react';
import { Book, Wrench, Bot, Sparkles } from 'lucide-react';

// Mock data - in a real app, this would come from your game state
const playerProfile = {
  learnedSkills: [
    { id: 'skill1', name: 'Botanical Mapping', icon: '🍁' },
    { id: 'skill2', name: 'Soil Restoration', icon: '🌱' }
  ],
  acquiredTools: [
    { id: 'tool1', name: 'Soil Harmonizer', icon: '🪛' },
    { id: 'tool2', name: 'Seed Infuser', icon: '🌾' }
  ],
  inventoryNodes: [
    { id: 'node1', name: 'Cedar', role: 'Restoration Guide', icon: '🤖' }
  ],
  currentHarmonyScore: 75
};

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-dream-bg p-8 font-interface">
      <header className="max-w-5xl mx-auto mb-12">
        <h1 className="text-4xl font-narrative mb-4">My Journey</h1>
        <p className="text-gray-600">Track your progress and acquired abilities</p>
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
              style={{ width: `${playerProfile.currentHarmonyScore}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Current Harmony: {playerProfile.currentHarmonyScore}%
          </p>
        </section>

        {/* Skills */}
        <section className="bg-white rounded-2xl p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <Book className="w-6 h-6 text-dream-primary" />
            <h2 className="text-2xl font-interface">Learned Skills</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playerProfile.learnedSkills.map(skill => (
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
            {playerProfile.acquiredTools.map(tool => (
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
            {playerProfile.inventoryNodes.map(node => (
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