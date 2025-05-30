import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Bot } from 'lucide-react';
import { useGameData } from '../hooks/useGameData';
import { usePlayerState } from '../hooks/usePlayerState';

type MissionCardProps = {
  missionId: string;
  zoneId: string;
};

export default function MissionCard({ missionId, zoneId }: MissionCardProps) {
  const navigate = useNavigate();
  const { playerState, actions } = usePlayerState();
  const { currentWorld } = useGameData(playerState.selectedGoalId);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);

  const mission = currentWorld?.missions.find(m => m.id === missionId);
  const requiredSkills = mission?.approachRequiredSkills || [];
  
  const hasAllSkills = requiredSkills.every(skillId => 
    playerState.learnedSkills.includes(skillId)
  );

  const availableNodes = currentWorld?.aiNodes.filter(node =>
    playerState.inventoryNodes.includes(node.id)
  );

  const handleStartMission = () => {
    if (!hasAllSkills) {
      setIsTrainingModalOpen(true);
      return;
    }
    actions.startMission(missionId);
    navigate(`/mission/${missionId}`);
  };

  const handleTrainSkill = (skillId: string, method: 'self' | 'shortTerm' | 'mastery') => {
    const skill = currentWorld?.skills.find(s => s.id === skillId);
    if (!skill) return;

    actions.addLearnedSkill(skillId);
    setIsTrainingModalOpen(false);
  };

  if (!mission) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-interface mb-3">{mission.name}</h3>
      <p className="text-gray-600 mb-4">{mission.goal}</p>

      {/* Required Skills */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Book className="w-4 h-4 text-dream-primary" />
          <span className="font-medium">Required Skills</span>
        </div>
        <div className="space-y-2">
          {requiredSkills.map(skillId => {
            const skill = currentWorld?.skills.find(s => s.id === skillId);
            const isLearned = playerState.learnedSkills.includes(skillId);
            
            return (
              <div 
                key={skillId}
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  isLearned ? 'bg-harmony-high/10' : 'bg-gray-100'
                }`}
              >
                <span className="text-xl">{skill?.icon}</span>
                <span className={isLearned ? 'text-harmony-high' : ''}>
                  {skill?.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleStartMission}
          className={`w-full px-4 py-2 rounded-lg transition ${
            hasAllSkills
              ? 'bg-dream-primary hover:bg-dream-primary-hover text-white'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {hasAllSkills ? 'Start Mission' : 'Train Required Skills'}
        </button>
      </div>

      {/* Training Modal */}
      {isTrainingModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-interface mb-6">Train Required Skills</h2>
            
            <div className="space-y-6">
              {requiredSkills.map(skillId => {
                const skill = currentWorld?.skills.find(s => s.id === skillId);
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

                      {availableNodes?.map(node => (
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