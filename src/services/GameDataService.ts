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

export type Mission = {
  id: string;
  name: string;
  goal: string;
  obstacles: string;
  approachRequiredSkills: string[];
  harmonyReward: number;
};

export type WorldEvent = {
  id: string;
  name: string;
  description: string;
  requiredSkills: string[];
  requiredTools: string[];
  timeToFix: string;
  eventTimeLimit: string;
  icon: string;
  harmonyReward: number;
};

export type Terrain = {
  id: string;
  terrainType: string;
  timeCost: number | null;
  icon: string;
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
  missions: Mission[];
  worldEvents: WorldEvent[];
  terrain: Terrain[];
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
        id?: string;
      }>;
    }>;
  }>;
};

export type GameConfig = Array<{
  goal: Goal;
  world: World;
}>;

export class GameDataService {
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

  getEventsToResolve(goalId: string): string[] {
    const world = this.getWorldByGoalId(goalId);
    if (!world) return [];
    
    // Get all event IDs from all zones
    return world.zones.flatMap(zone => 
      zone.locations
        .filter(loc => loc.items.some(item => item.type === 'worldEvents'))
        .map(loc => loc.items.find(item => item.type === 'worldEvents')?.id)
        .filter((id): id is string => id !== undefined)
    );
  }
}

export const gameDataService = new GameDataService();