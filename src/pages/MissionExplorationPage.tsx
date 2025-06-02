import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Map, ArrowLeft, Bot, PenTool as Tool, Target } from 'lucide-react';
import { useGameData } from '../hooks/useGameData';
import { usePlayerState } from '../hooks/usePlayerState';
import HUDOverlay from '../components/HUDOverlay';

type Location = {
  id: string;
  coordinates: number[];
  items: Array<{
    type: string;
    id?: string;
  }>;
};

function ToolInfo({ tool, requiredSkills, playerState, currentWorld, showSkills }: { tool: any, requiredSkills: string[], playerState: any, currentWorld: any, showSkills: boolean }) {
  return (
    <>
      <span className="text-xs">{tool?.icon}</span>
      <span className="text-xs text-gray-700">{tool?.name}</span>
      {showSkills && (
        <span className="text-xs text-gray-500">Required Skill{requiredSkills.length > 1 ? 's' : ''}: {requiredSkills.map(skillId => {
          const skill = currentWorld.skills.find((s: any) => s.id === skillId);
          const isLearned = playerState.learnedSkills.includes(skillId);
          return (
            <span key={skillId} className={isLearned ? 'text-harmony-high ml-1' : 'text-red-500 ml-1'}>
              {skill?.name}
            </span>
          );
        })}</span>
      )}
    </>
  );
}

// Add LocationToolItem component
function LocationToolItem({ item, x, y, currentPosition, zone, currentWorld, playerState, actions, setTrainingSkillId, setTrainingSkillOptions, setIsTrainingModalOpen, getTrainingOptions }: any) {
  const tool = currentWorld.tools.find((t: any) => t.id === item.id);
  const toolLocation = zone.locations.find((loc: any) =>
    loc.items.some((i: any) => i.type === 'tools' && i.id === item.id)
  );
  const isAtToolLocation = toolLocation &&
    currentPosition[0] === toolLocation.coordinates[0] &&
    currentPosition[1] === toolLocation.coordinates[1];
  const requiredSkills = tool?.requiredSkills || [];
  const hasAllSkills = requiredSkills.every((skillId: string) => playerState.learnedSkills.includes(skillId));
  const isToolCollected = playerState.acquiredTools.includes(item.id || '');
  const missingSkills = requiredSkills.filter((skillId: string) => !playerState.learnedSkills.includes(skillId));
  const [isCollected, setIsCollected] = useState(false);

  const handleCollect = () => {
    actions.addAcquiredTool(item.id || '');
    setIsCollected(true);
  };

  return (
    <div className="flex flex-col items-start gap-1 mb-2">
      <ToolInfo tool={tool} requiredSkills={requiredSkills} playerState={playerState} currentWorld={currentWorld} showSkills={!!isAtToolLocation} />
      {isAtToolLocation && (
        <>
          {/* Train button only in grid cell */}
          {!hasAllSkills && missingSkills.map((skillId: string) => {
            const skill = currentWorld.skills.find((s: any) => s.id === skillId);
            if (!skill) return null;
            return (
              <button
                key={skillId}
                onClick={() => {
                  setTrainingSkillId(skillId);
                  setTrainingSkillOptions(getTrainingOptions(skill));
                  setIsTrainingModalOpen(true);
                }}
                className="mt-1 px-3 py-1 bg-dream-primary hover:bg-dream-primary-hover text-white rounded-lg text-xs transition"
              >
                Train
              </button>
            );
          })}
          {hasAllSkills && !isToolCollected && !isCollected && (
            <button
              onClick={handleCollect}
              className="mt-1 px-3 py-1 bg-dream-primary hover:bg-dream-primary-hover text-white rounded-lg text-xs transition"
            >
              PickMe
            </button>
          )}
          {(hasAllSkills && (isToolCollected || isCollected)) && (
            <span className="mt-1 text-xs text-harmony-high">Collected</span>
          )}
        </>
      )}
    </div>
  );
}

// Add LocationAINodeItem component
function LocationAINodeItem({ item, x, y, currentPosition, currentWorld, playerState, actions }: any) {
  const node = currentWorld.aiNodes.find((n: any) => n.id === item.id);
  const isNodeCollected = playerState.inventoryNodes.includes(item.id || '');
  const isAtNodeLocation = x === currentPosition[0] && y === currentPosition[1];
  const [isCollected, setIsCollected] = useState(false);

  const handleCollect = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.addInventoryNode(item.id || '');
    setIsCollected(true);
  };

  return (
    <div className="flex flex-col items-center mb-1">
      <span className="text-xl">{node?.icon}</span>
      <span className="text-xs text-gray-700">{node?.name}</span>
      {!isNodeCollected && !isCollected && isAtNodeLocation && (
        <button
          type="button"
          onClick={handleCollect}
          className="mt-1 px-2 py-0.5 bg-dream-primary hover:bg-dream-primary-hover text-white rounded-lg text-xs transition"
        >
          PickMe
        </button>
      )}
      {(isNodeCollected || isCollected) && isAtNodeLocation && (
        <span className="mt-1 text-xs text-harmony-high">Collected</span>
      )}
    </div>
  );
}

// Add LocationEventItem component
function LocationEventItem({ item, x, y, currentPosition, currentWorld, playerState, actions }: any) {
  const event = currentWorld.worldEvents.find((e: any) => e.id === item.id);
  if (!event) return null;
  const requiredTools = event.requiredTools || [];
  const hasAllTools = requiredTools.every((toolId: string) => playerState.acquiredTools.includes(toolId));
  const isAtEventLocation = x === currentPosition[0] && y === currentPosition[1];
  // Find the mission associated with this zone
  const zone = currentWorld.zones.find((z: any) => 
    z.locations.some((loc: any) => 
      loc.items.some((i: any) => i.type === 'worldEvents' && i.id === event.id)
    )
  );
  const mission = zone ? currentWorld.missions.find((m: any) => zone.missions.includes(m.id)) : null;
  const [isRestored, setIsRestored] = useState(false);
  const isEventRestored = playerState.restoredEvents.includes(event.id);
  const isZoneRestored = playerState.worldZonesRestored.includes(zone?.id || '');
  const navigate = useNavigate();

  const handleFix = () => {
    // First add the event to restored events
    actions.addRestoredEvent(event.id);
    
    // Then complete the mission if it exists
    if (mission) {
      actions.completeMission(mission.id);
      // Add harmony reward from the event
      if (event.harmonyReward) {
        actions.updateHarmonyScore(playerState.currentHarmonyScore + event.harmonyReward);
      }
    }

    // Check if all events in the zone are restored
    const allEventsInZone = zone?.locations
      .filter((loc: any) => loc.items.some((i: any) => i.type === 'worldEvents'))
      .map((loc: any) => loc.items.find((i: any) => i.type === 'worldEvents')?.id)
      .filter(Boolean) || [];

    const allEventsRestored = allEventsInZone.every((eventId: string) => 
      playerState.restoredEvents.includes(eventId)
    );

    // If all events are restored, mark the zone as restored
    if (allEventsRestored && zone) {
      actions.restoreZone(zone.id);
    }

    setIsRestored(true);
    // Redirect to goal selection page after a short delay to show the "Restored" message
    setTimeout(() => {
      navigate('/choose-goal');
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center mb-1">
      <span className="text-xl">{event?.icon}</span>
      <span className="text-xs text-gray-700">{event?.name}</span>
      {isAtEventLocation && !hasAllTools && requiredTools.length > 0 && (
        <span className="text-xs text-red-500 mt-1">
          Required tool{requiredTools.length > 1 ? 's' : ''} to collect: {requiredTools.map((toolId: string, idx: number) => {
            const tool = currentWorld.tools.find((t: any) => t.id === toolId);
            const isCollected = playerState.acquiredTools.includes(toolId);
            return (
              <span key={toolId} className={isCollected ? 'text-harmony-high ml-1' : 'text-red-500 ml-1'}>
                {tool?.name || toolId}{idx < requiredTools.length - 1 ? ', ' : ''}
              </span>
            );
          })}
        </span>
      )}
      {isAtEventLocation && hasAllTools && !isRestored && !isEventRestored && (
        <button
          type="button"
          onClick={handleFix}
          className="mt-1 px-2 py-0.5 bg-dream-primary hover:bg-dream-primary-hover text-white rounded-lg text-xs transition"
        >
          FixMe
        </button>
      )}
      {(isAtEventLocation && (isRestored || isEventRestored)) && (
        <span className="mt-1 text-xs text-harmony-high">Restored</span>
      )}
    </div>
  );
}

export default function MissionExplorationPage() {
  const { zoneId } = useParams();
  const navigate = useNavigate();
  const { playerState, actions } = usePlayerState();
  const { zones, currentWorld } = useGameData(playerState.selectedGoalId || undefined);

  const zone = zones?.find(z => z.id === zoneId);
  
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([0, 0]);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [trainingSkillId, setTrainingSkillId] = useState<string | null>(null);
  const [trainingSkillOptions, setTrainingSkillOptions] = useState<any[]>([]);
  const [selectedTrainingMethod, setSelectedTrainingMethod] = useState<string>('');
  const [isWorldRestoredModalOpen, setIsWorldRestoredModalOpen] = useState(false);

  // Check if world is restored
  const checkWorldRestoration = useCallback(() => {
    if (!zones || !currentWorld) return;

    // Check if all zones are restored
    const allZonesRestored = zones.every(zone => 
      playerState.worldZonesRestored.includes(zone.id)
    );

    if (allZonesRestored) {
      setIsWorldRestoredModalOpen(true);
    }
  }, [zones, currentWorld, playerState.worldZonesRestored]);

  // Check world restoration after any relevant state changes
  useEffect(() => {
    checkWorldRestoration();
  }, [checkWorldRestoration, playerState.worldZonesRestored]);

  useEffect(() => {
    // Find starting position (location with start item)
    const startLocation = zone?.locations.find(loc => 
      loc.items.some(item => item.type === 'start')
    );
    if (startLocation) {
      const [x, y] = startLocation.coordinates;
      setCurrentPosition([x, y]);
      actions.updateLocation(x, y);
    }
  }, [zone]);

  const getLocationAt = useCallback((x: number, y: number): Location | undefined => {
    return zone?.locations.find(loc => 
      loc.coordinates[0] === x && loc.coordinates[1] === y
    );
  }, [zone]);

  const isValidMove = useCallback((x: number, y: number): boolean => {
    if (!zone) return false;
    
    // Check bounds
    if (x < 0 || x >= zone.gridSize[0] || y < 0 || y >= zone.gridSize[1]) {
      return false;
    }

    // Check if terrain is passable
    const location = getLocationAt(x, y);
    if (!location) return false;

    const terrain = currentWorld?.terrain.find(t => 
      location.items.some(item => item.type === 'terrain' && item.id === t.id)
    );

    return terrain?.timeCost !== null;
  }, [zone, currentWorld, getLocationAt]);

  const handleMove = useCallback((newX: number, newY: number) => {
    if (isValidMove(newX, newY)) {
      const location = getLocationAt(newX, newY);
      if (location) {
        const terrain = currentWorld?.terrain.find(t => 
          location.items.some(item => item.type === 'terrain' && item.id === t.id)
        );
        if (terrain?.timeCost) {
          actions.addTime(terrain.timeCost);
        }
      }
      setCurrentPosition([newX, newY]);
      actions.updateLocation(newX, newY);
    }
  }, [isValidMove, actions, getLocationAt, currentWorld]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const [x, y] = currentPosition;
    
    switch (e.key) {
      case 'ArrowUp':
        handleMove(x, y - 1);
        break;
      case 'ArrowDown':
        handleMove(x, y + 1);
        break;
      case 'ArrowLeft':
        handleMove(x - 1, y);
        break;
      case 'ArrowRight':
        handleMove(x + 1, y);
        break;
    }
  }, [currentPosition, handleMove]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Helper to get available training options for a skill
  const getTrainingOptions = (skill: any) => {
    const options = [];
    if (skill.canSelfTrain) {
      options.push({ method: 'self', label: `Self-Train (${skill.selfTrainingTime})` });
    }
    if (skill.aiSupport) {
      const shortTermNode = currentWorld?.aiNodes.find(n => n.id === skill.aiSupport.shortTermNode);
      const masteryNode = currentWorld?.aiNodes.find(n => n.id === skill.aiSupport.masteryNode);
      if (shortTermNode && playerState.inventoryNodes.includes(shortTermNode.id)) {
        options.push({ method: 'shortTerm', label: `Short-Term AI (${shortTermNode.name}, ${shortTermNode.training.shortTerm})` });
      }
      if (masteryNode && playerState.inventoryNodes.includes(masteryNode.id)) {
        options.push({ method: 'mastery', label: `Mastery AI (${masteryNode.name}, ${masteryNode.training.mastery})` });
      }
    }
    return options;
  };

  // Helper to parse time strings like '2h', '3d' to hours
  const parseTimeToHours = (timeStr: string): number => {
    if (!timeStr) return 0;
    const match = timeStr.match(/(\d+)([hd])/);
    if (!match) return 0;
    const value = parseInt(match[1], 10);
    const unit = match[2];
    if (unit === 'h') return value;
    if (unit === 'd') return value * 24;
    return 0;
  };

  if (!zone || !currentWorld) {
    navigate('/map');
    return null;
  }

  return (
    <div className="min-h-screen bg-dream-bg p-8 font-interface">
      <HUDOverlay />
      <header className="max-w-5xl mx-auto mb-12">
        <button
          onClick={() => navigate(`/zone/${zoneId}`)}
          className="flex items-center gap-2 text-dream-primary hover:text-dream-primary-hover transition mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Zone
        </button>
        <div className="flex items-center gap-3 mb-4">
          <Map className="w-8 h-8 text-dream-primary" />
          <h1 className="text-4xl font-narrative">{zone.name}</h1>
        </div>
        <p className="text-gray-600">Navigate the zone to collect tools and meet AI Nodes</p>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Grid Navigation */}
          <div className="lg:col-span-2">
            <div 
              className="grid gap-2 bg-white p-4 rounded-2xl shadow-md"
              style={{
                gridTemplateColumns: `repeat(${zone.gridSize[0]}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${zone.gridSize[1]}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: zone.gridSize[1] }, (_, y) =>
                Array.from({ length: zone.gridSize[0] }, (_, x) => {
                  const location = getLocationAt(x, y);
                  const terrain = location && currentWorld.terrain.find(t =>
                    location.items.some(item => item.type === 'terrain' && item.id === t.id)
                  );
                  const isCurrentPosition = x === currentPosition[0] && y === currentPosition[1];
                  const isValidNextMove = isValidMove(x, y);
                  const dx = Math.abs(x - currentPosition[0]);
                  const dy = Math.abs(y - currentPosition[1]);
                  const isAdjacent = (dx === 1 && dy === 0) || (dx === 0 && dy === 1);

                  return (
                    <button
                      key={`${x}-${y}`}
                      onClick={() => {
                        if (isAdjacent) {
                          handleMove(x, y);
                        }
                      }}
                      disabled={!isValidNextMove}
                      className={`
                        aspect-square rounded-lg p-2 flex flex-col items-center justify-start relative
                        transition-all duration-200
                        ${isCurrentPosition ? 'ring-2 ring-dream-primary' : ''}
                        ${isValidNextMove && isAdjacent ? 'hover:bg-dream-primary/10 cursor-pointer' : 'cursor-default'}
                        ${terrain?.timeCost === null ? 'bg-gray-200' : 'bg-dream-zone-bg'}
                      `}
                    >
                      {/* Item icons and names stacked at the top */}
                      <div className="flex flex-col items-center w-full mb-1">
                        {location?.items.map((item, idx) => {
                          if (item.type === 'tools') {
                            return (
                              <LocationToolItem
                                key={idx}
                                item={item}
                                x={x}
                                y={y}
                                currentPosition={currentPosition}
                                zone={zone}
                                currentWorld={currentWorld}
                                playerState={playerState}
                                actions={actions}
                                setTrainingSkillId={setTrainingSkillId}
                                setTrainingSkillOptions={setTrainingSkillOptions}
                                setIsTrainingModalOpen={setIsTrainingModalOpen}
                                getTrainingOptions={getTrainingOptions}
                              />
                            );
                          }
                          if (item.type === 'aiNodes') {
                            return (
                              <LocationAINodeItem
                                key={idx}
                                item={item}
                                x={x}
                                y={y}
                                currentPosition={currentPosition}
                                currentWorld={currentWorld}
                                playerState={playerState}
                                actions={actions}
                              />
                            );
                          }
                          if (item.type === 'worldEvents') {
                            return (
                              <LocationEventItem
                                key={idx}
                                item={item}
                                x={x}
                                y={y}
                                currentPosition={currentPosition}
                                currentWorld={currentWorld}
                                playerState={playerState}
                                actions={actions}
                              />
                            );
                          }
                          return null;
                        })}
                      </div>
                      {/* Terrain icon bottom right */}
                      {location?.items.map((item, idx) => {
                        if (item.type === 'terrain') {
                          const terrainData = currentWorld.terrain.find(t => t.id === item.id);
                          return (
                            <span key={idx} className="absolute bottom-1 right-1 text-xs opacity-50">
                              <span className="text-xs">{terrainData?.icon}</span>
                            </span>
                          );
                        }
                        return null;
                      })}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Location Info */}
          <div className="space-y-6">
            <section className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-interface mb-4">Current Location</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Coordinates</span>
                  <span className="font-mono">
                    [{currentPosition[0]}, {currentPosition[1]}]
                  </span>
                </div>
                
                {/* Location Items */}
                {/* (No item info displayed in current location) */}
              </div>
            </section>

            {/* Navigation Help */}
            <section className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-interface mb-4">Navigation</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Use arrow keys or click adjacent tiles to move</p>
                <p>🪨 Rock terrain cannot be crossed</p>
                <p>Movement time depends on terrain type</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {isTrainingModalOpen && trainingSkillId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="text-lg font-bold mb-4">Train Skill</h2>
            <div className="mb-4">
              {(() => {
                const skill = currentWorld?.skills.find((s: any) => s.id === trainingSkillId);
                if (!skill) return null;
                const shortTermNode = skill.aiSupport && currentWorld?.aiNodes.find((n: any) => n.id === skill.aiSupport.shortTermNode);
                const masteryNode = skill.aiSupport && currentWorld?.aiNodes.find((n: any) => n.id === skill.aiSupport.masteryNode);
                const hasShortTermNode = shortTermNode && playerState.inventoryNodes.includes(shortTermNode.id);
                const hasMasteryNode = masteryNode && playerState.inventoryNodes.includes(masteryNode.id);
                return (
                  <>
                    <div className="mb-2 text-sm font-medium">{skill?.name}</div>
                    <div className="space-y-2">
                      {/* Self-Train Option */}
                      {skill.canSelfTrain && (
                        <button
                          onClick={() => {
                            actions.addTime(parseTimeToHours(skill.selfTrainingTime));
                            actions.addLearnedSkill(trainingSkillId);
                            setIsTrainingModalOpen(false);
                            setTrainingSkillId(null);
                            setTrainingSkillOptions([]);
                            setSelectedTrainingMethod('');
                          }}
                          className="block w-full text-left px-4 py-2 rounded-lg border border-dream-primary text-dream-primary hover:bg-dream-primary hover:text-white transition mb-1 text-xs"
                        >
                          Self-Train ({skill.selfTrainingTime})
                        </button>
                      )}
                      {/* Short-Term AI Option */}
                      {shortTermNode && (
                        <div>
                          <button
                            disabled={!hasShortTermNode}
                            onClick={() => {
                              if (!hasShortTermNode) return;
                              actions.addTime(parseTimeToHours(shortTermNode.training.shortTerm));
                              actions.addLearnedSkill(trainingSkillId);
                              setIsTrainingModalOpen(false);
                              setTrainingSkillId(null);
                              setTrainingSkillOptions([]);
                              setSelectedTrainingMethod('');
                            }}
                            className={`block w-full text-left px-4 py-2 rounded-lg border border-dream-primary transition mb-1 text-xs ${hasShortTermNode ? 'text-dream-primary hover:bg-dream-primary hover:text-white' : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}
                          >
                            Short-Term AI ({shortTermNode.name}, {shortTermNode.training.shortTerm})
                          </button>
                          {!hasShortTermNode && (
                            <div className="text-xs text-red-500 ml-2 mt-1">Pick {shortTermNode.name} to unlock this training.</div>
                          )}
                        </div>
                      )}
                      {/* Mastery AI Option */}
                      {masteryNode && (
                        <div>
                          <button
                            disabled={!hasMasteryNode}
                            onClick={() => {
                              if (!hasMasteryNode) return;
                              actions.addTime(parseTimeToHours(masteryNode.training.mastery));
                              actions.addLearnedSkill(trainingSkillId);
                              setIsTrainingModalOpen(false);
                              setTrainingSkillId(null);
                              setTrainingSkillOptions([]);
                              setSelectedTrainingMethod('');
                            }}
                            className={`block w-full text-left px-4 py-2 rounded-lg border border-dream-primary transition mb-1 text-xs ${hasMasteryNode ? 'text-dream-primary hover:bg-dream-primary hover:text-white' : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}
                          >
                            Mastery AI ({masteryNode.name}, {masteryNode.training.mastery})
                          </button>
                          {!hasMasteryNode && (
                            <div className="text-xs text-red-500 ml-2 mt-1">Pick {masteryNode.name} to unlock this training.</div>
                          )}
                        </div>
                      )}
                      {/* No options at all */}
                      {!skill.canSelfTrain && !shortTermNode && !masteryNode && (
                        <div className="text-red-500 text-xs">No available training options. Collect the right AI Node or check self-training.</div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
            <button
              onClick={() => {
                setIsTrainingModalOpen(false);
                setTrainingSkillId(null);
                setTrainingSkillOptions([]);
                setSelectedTrainingMethod('');
              }}
              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* World Restored Modal */}
      {isWorldRestoredModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            <h2 className="text-2xl font-narrative mb-4">World Restored!</h2>
            <p className="text-gray-600 mb-6">
              Congratulations! You have successfully restored harmony to this world.
              Your actions have brought balance and healing to all zones.
            </p>
            <button
              onClick={() => {
                setIsWorldRestoredModalOpen(false);
                navigate('/choose-goal');
              }}
              className="px-6 py-2 bg-dream-primary hover:bg-dream-primary-hover text-white rounded-lg transition"
            >
              Choose New Goal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}