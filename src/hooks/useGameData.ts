import { useState, useEffect } from 'react';
import { gameDataService, Goal, World } from '../services/GameDataService';

export function useGameData(goalId?: string) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentWorld, setCurrentWorld] = useState<World | undefined>();
  const [currentGoal, setCurrentGoal] = useState<Goal | undefined>();

  useEffect(() => {
    setGoals(gameDataService.getGoals());
  }, []);

  useEffect(() => {
    if (goalId) {
      setCurrentWorld(gameDataService.getWorldByGoalId(goalId));
      setCurrentGoal(gameDataService.getGoalById(goalId));
    }
  }, [goalId]);

  return {
    goals,
    currentWorld,
    currentGoal,
    zones: goalId ? gameDataService.getZones(goalId) : undefined,
    skills: goalId ? gameDataService.getSkills(goalId) : undefined,
    tools: goalId ? gameDataService.getTools(goalId) : undefined,
    aiNodes: goalId ? gameDataService.getAINodes(goalId) : undefined,
  };
}