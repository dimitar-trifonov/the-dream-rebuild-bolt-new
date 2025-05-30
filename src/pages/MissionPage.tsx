import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Target, PenTool as Tool, Bot, Book, ArrowLeft, Play } from 'lucide-react';
import { useGameData } from '../hooks/useGameData';
import { usePlayerState } from '../hooks/usePlayerState';

export default function MissionPage() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const { playerState, actions } = usePlayerState();
  const { currentWorld, zones } = useGameData(playerState.selectedGoalId);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);

  const mission = currentWorld?.missions.find(m => m.id === missionId);
  const event = currentWorld?.worldEvents.find(e => e.id === missionId);
  const zone = zones?.find(z => z.missions.includes(missionId || ''));

  if (!mission || !currentWorld) {
    navigate('/map');
    return null;
  }

  const requiredSkills = [
    ...mission.approachRequiredSkills,
    ...(event?.requiredSkills || [])
  ];

  const requiredTools = event?.requiredTools || [];

  const hasAllSkills = requiredSkills.every(skillId => 
    playerState.learnedSkills.includes(skillId)
  );

  const hasAllTools = requiredTools.every(toolId =>
    playerState.acquiredTools.includes(toolId)
  );

  const availableNodes = currentWorld.aiNodes.filter(node =>
    playerState.inventoryNodes.includes(node.id)
  );

  const handleTrainSkill = (skillId: string, method: 'self' | 'shortTerm' | 'mastery') => {
    const skill = currentWorld.skills.find(s => s.id === skillId);
    if (!skill) return;

    actions.addLearnedSkill(skillId);
    setIsTrainingModalOpen(false);
  };

  const handleStartMission = () => {
    if (!hasAllSkills) {
      setIsTrainingModalOpen(true);
      return;
    }
    actions.startMission(missionId);
    if (zone) {
      navigate(`/zone/${zone.id}/explore`);
    }
  };

  return (
    <div className="min-h-screen bg-dream-bg p-8 font-interface">
      <header className="max-w-5xl mx-auto mb-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-dream-primary hover:text-dream-primary-hover transition mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-8 h-8 text-dream-primary" />
          <h1 className="text-4xl font-narrative">{mission.name}</h1>
        </div>
        <p className="text-gray-600">{mission.goal}</p>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Mission Details */}
            <section className="bg-white rounded-2xl p-8 shadow-md">
              <h2 className="text-2xl font-interface mb-4">Mission Overview</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Goal</h3>
                  <p className="text-gray-600">{mission.goal}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Obstacles</h3>
                  <p className="text-gray-600">{mission.obstacles}</p>
                </div>
                {event && (
                  <div>
                    <h3 className="font-medium mb-2">World Event</h3>
                    <p className="text-gray-600">{event.description}</p>
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <span className="px-3 py-1 bg-dream-primary/10 text-dream-primary rounded-full">
                        {event.timeToFix} to fix
                      </span>
                      <span className="px-3 py-1 bg-harmony-high/10 text-harmony-high rounded-full">
                        +{event.harmonyReward} Harmony
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Required Skills */}
            <section className="bg-white rounded-2xl p-8 shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <Book className="w-6 h-6 text-dream-primary" />
                <h2 className="text-2xl font-interface">Required Skills</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requiredSkills.map(skillId => {
                  const skill = currentWorld.skills.find(s => s.id === skillId);
                  const isLearned = playerState.learnedSkills.includes(skillId);
                  
                  return (
                    <div 
                      key={skillId}
                      className={`p-4 rounded-lg ${
                        isLearned ? 'bg-harmony-high/10' : 'bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{skill?.icon}</span>
                        <div>
                          <div className={`font-medium ${isLearned ? 'text-harmony-high' : ''}`}>
                            {skill?.name}
                          </div>
                          {!isLearned && (
                            <button
                              onClick={() => setIsTrainingModalOpen(true)}
                              className="text-sm text-dream-primary hover:text-dream-primary-hover transition"
                            >
                              Train this skill
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Required Tools */}
            {requiredTools.length > 0 && (
              <section className="bg-white rounded-2xl p-8 shadow-md">
                <div className="flex items-center gap-2 mb-6">
                  <Tool className="w-6 h-6 text-dream-primary" />
                  <h2 className="text-2xl font-interface">Required Tools</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {requiredTools.map(toolId => {
                    const tool = currentWorld.tools.find(t => t.id === toolId);
                    const isAcquired = playerState.acquiredTools.includes(toolId);
                    
                    return (
                      <div 
                        key={toolId}
                        className={`p-4 rounded-lg ${
                          isAcquired ? 'bg-harmony-high/10' : 'bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{tool?.icon}</span>
                          <div>
                            <div className={`font-medium ${isAcquired ? 'text-harmony-high' : ''}`}>
                              {tool?.name}
                            </div>
                            {!isAcquired && (
                              <div className="text-sm text-gray-500">
                                Find this tool in the zone
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mission Status */}
            <section className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-interface mb-4">Mission Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Skills Ready</span>
                  <span className={hasAllSkills ? 'text-harmony-high' : 'text-gray-500'}>
                    {hasAllSkills ? 'Yes' : 'No'}
                  </span>
                </div>
                {requiredTools.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Tools Ready</span>
                    <span className={hasAllTools ? 'text-harmony-high' : 'text-gray-500'}>
                      {hasAllTools ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}
                {event && (
                  <div className="flex items-center justify-between">
                    <span>Time Limit</span>
                    <span>{event.eventTimeLimit}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Available AI Nodes */}
            {availableNodes.length > 0 && (
              <section className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="w-5 h-5 text-dream-primary" />
                  <h2 className="text-xl font-interface">Available AI Support</h2>
                </div>
                <div className="space-y-3">
                  {availableNodes.map(node => (
                    <div key={node.id} className="p-3 bg-dream-zone-bg rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{node.icon}</span>
                        <div>
                          <div className="font-medium">{node.name}</div>
                          <div className="text-sm text-gray-600">{node.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Action Buttons */}
            <section className="bg-white rounded-2xl p-6 shadow-md">
              <button
                onClick={handleStartMission}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition ${
                  hasAllSkills
                    ? 'bg-dream-primary hover:bg-dream-primary-hover text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <Play className="w-5 h-5" />
                {hasAllSkills ? 'Start Mission' : 'Train Required Skills'}
              </button>
            </section>
          </div>
        </div>
      </main>

      {/* Training Modal */}
      {isTrainingModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-interface mb-6">Train Required Skills</h2>
            
            <div className="space-y-6">
              {requiredSkills.map(skillId => {
                const skill = currentWorld.skills.find(s => s.id === skillId);
                if (!skill) return null;

                const isLearned = playerState.learnedSkills.includes(skillId);
                if (isLearned) return null;

                return (
                  <div key={skillId} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{skill.icon}</span>
                      <span className="font-medium">{skill.name}</span>
                    </div>

                    <div className="space-y-2">
                      {skill.canSelfTrain && (
                        <button
                          onClick={() => handleTrainSkill(skillId, 'self')}
                          className="w-full px-4 py-2 bg-dream-secondary hover:bg-dream-secondary/90 rounded-lg transition flex items-center justify-between"
                        >
                          <span>Self Training</span>
                          <span className="text-sm">{skill.selfTrainingTime}</span>
                        </button>
                      )}

                      {availableNodes.map(node => (
                        <button
                          key={node.id}
                          onClick={() => handleTrainSkill(skillId, 'shortTerm')}
                          className="w-full px-4 py-2 bg-dream-primary hover:bg-dream-primary-hover text-white rounded-lg transition flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4" />
                            <span>Train with {node.name}</span>
                          </div>
                          <span className="text-sm">{node.training.shortTerm}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsTrainingModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}