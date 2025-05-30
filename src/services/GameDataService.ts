import gameConfig from '../data/the-dream-game-config.json';

export type Goal = {
  id: string;
  title: string;
  description: string;
  themeColor: string;
  icon: string;
  worldPhilosophy: string;
  tone: string;
};

export type World = {
  worldPrompt: {
    worldThemes: string[];
    narrativeRules: string[];
    randomEventTypes: string[];
    resourceConstraints: string[];
    toneGuide: string;
  };
  skills: Array<{
    id: string;
    name: string;
    aiSupport: {
      shortTermNode: string;
      masteryNode: string;
    };
    canSelfTrain: boolean;
    selfTrainingTime: string;
    icon: string;
  }>;
  tools: Array<{
    id: string;
    name: string;
    requiredSkills: string[];
    icon: string;
  }>;
  aiNodes: Array<{
    id: string;
    name: string;
    icon: string;
    role: string;
    personality: string;
    supportType: string;
    training: {
      shortTerm: string;
      mastery: string;
    };
  }>;
  zones: Array<{
    id: string;
    name: string;
    gridSize: number[];
    missions: string[];
    locations: Array<{
      id: string;
      coordinates: number[];
      items: Array<{
        type: string;
        id: string;
      }>;
    }>;
  }>;
};

export type GameConfig = Array<{
  goal: Goal;
  world: World;
}>;

class GameDataService {
  private config: GameConfig;

  constructor() {
    this.config = gameConfig;
  }

  getGoals(): Goal[] {
    return this.config.map(item => item.goal);
  }

  getWorldByGoalId(goalId: string): World | undefined {
    const configItem = this.config.find(item => item.goal.id === goalId);
    return configItem?.world;
  }

  getGoalById(goalId: string): Goal | undefined {
    return this.config.find(item => item.goal.id === goalId)?.goal;
  }

  getZones(goalId: string): World['zones'] | undefined {
    return this.getWorldByGoalId(goalId)?.zones;
  }

  getSkills(goalId: string): World['skills'] | undefined {
    return this.getWorldByGoalId(goalId)?.skills;
  }

  getTools(goalId: string): World['tools'] | undefined {
    return this.getWorldByGoalId(goalId)?.tools;
  }

  getAINodes(goalId: string): World['aiNodes'] | undefined {
    return this.getWorldByGoalId(goalId)?.aiNodes;
  }
}

export const gameDataService = new GameDataService();