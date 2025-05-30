
# 📚 The Dream — Game Config Structure (v3.4.1)

This document defines the updated structure of game-config.json used in *The Dream* MVP.  
It introduces the finalized time model for event resolution and separates preparation and execution time calculations.

---

## 🎯 Top-Level Structure
```json
[ { "goal": { ... }, "world": { ... } } ]
```
Each item represents a life goal and its corresponding world definition.

---

## 🌍 Goal Object
```json
"goal": {
  "id": "goal1",
  "title": "Restore Nature",
  "description": "Goal description...",
  "themeColor": "bg-dream-primary",
  "icon": "🌿",
  "worldPhilosophy": "Nature will return if given space...",
  "tone": "Gentle, meditative, hopeful."
}
```

---

## 🌐 World Object Sections
- `worldPrompt`: Narrative and thematic rules
- `skills[]`: Skills with training options and AI Node support
- `tools[]`: Tools and required skills to use them
- `aiNodes[]`: AI mentors for skill support
- `worldEvents[]`: Harmony challenges (now with new time model)
- `missions[]`: Missions linked by ID in zones
- `zones[]`: World zones with maze-like, grid-based layouts
- `terrain[]`: Predefined terrain types

---

🗺️ World Zones (With Maze Support)
```json
"zones": [
  {
    "id": "zone1",
    "name": "Verdant Hollow",
    "gridSize": [5, 5],
    "missions": ["mission1"],
    "locations": [
      {
        "id": "loc1",
        "coordinates": [2, 3],
        "items": [
          { "type": "terrain", "id": "terrain1" },
          { "type": "aiNodes", "id": "node1" }
        ]
      }
    ]
  }
]
```

📌 Maze Generation and Navigation Rules
- Each location must include one terrain item.
- Items (tools, aiNodes, worldEvents) can appear only on passable terrain.
- No items are allowed on "rock" terrain.
- Player start location must be on a passable terrain tile.
- Movement allowed with arrow keys or mouse clicks; directions: up, down, left, right.
- Movement cost is determined by the terrain's timeCost property.

🌾 Terrain Definitions
```json
"terrain": [
  { "id": "terrain1", "terrainType": "sand", "timeCost": 3, "icon": "🏖️" },
  { "id": "terrain2", "terrainType": "ground", "timeCost": 2, "icon": "🌱" },
  { "id": "terrain3", "terrainType": "pave", "timeCost": 1, "icon": "🧱" },
  { "id": "terrain4", "terrainType": "rock", "timeCost": null, "icon": "🪨" }
]
```

⏳ Suggested Terrain Time Costs
Terrain	Time Cost (Units)	Passable
sand	3	✅ Yes
ground	2	✅ Yes
pave	1	✅ Yes
rock	N/A	❌ No

🎯 Missions
```json
"missions": [
  {
    "id": "mission1",
    "name": "Reclaim the Grove",
    "goal": "Free native trees...",
    "obstacles": "Dense underbrush...",
    "approachRequiredSkills": ["skill1"],
    "harmonyReward": 15
  }
]
```

🛠️ Tools
```json
"tools": [
  {
    "id": "tool1",
    "name": "Soil Harmonizer",
    "requiredSkills": ["skill1"],
    "icon": "🪛"
  },
  {
    "id": "tool2",
    "name": "Seed Infuser",
    "requiredSkills": ["skill2"],
    "icon": "🌾"
  }
]
```

📚 Skills
```json
"skills": [
  {
    "id": "skill1",
    "name": "Botanical Mapping",
    "aiSupport": { "shortTermNode": "Mira", "masteryNode": "Cedar" },
    "canSelfTrain": true,
    "selfTrainingTime": "5h",
    "icon": "🍁"
  },
  {
    "id": "skill2",
    "name": "Soil Restoration",
    "aiSupport": { "shortTermNode": "Mira", "masteryNode": "Cedar" },
    "canSelfTrain": true,
    "selfTrainingTime": "8h",
    "icon": "🌱"
  }
]
```

📖 Tools & Skills Usage Rules
Rule	Applies To	Description
Tools require skills to use	Tools	Defined in requiredSkills.
Skills unlock through training or AI support	Skills	Self-train or accelerate via AI Nodes.
Tools can only be used if player has required skills	Tools	Enforced via UI and validation logic.
AI Nodes accelerate skill mastery	Skills	AI Node IDs defined in aiSupport.
Skills contribute to mission access	Skills	Some missions require specific skills.
Tools appear in inventory and planning	Tools	Displayed with icon.
Skills unlock new tool access	Skills	Tools become available when skills are learned.

🤖 AI Nodes
```json
"aiNodes": [
  {
    "id": "node1",
    "name": "Cedar",
    "icon": "🤖",
    "role": "Restoration Guide",
    "personality": "Patient, earthy, poetic",
    "supportType": "Skill practice and reflection prompts",
    "training": { "shortTerm": "1h", "mastery": "3d" },
    "dataEngineeringTime": "8h"
  }
]
```
📘 Notes on dataEngineeringTime
Represents the time needed to prepare and activate an AI Node for skill support.
This time is added to the Time Tracker when the player picks the AI Node in the maze.
Encourages strategic use of AI Node support and adds weight to activation decisions.
Treated as an explicit in-game action.

📚 Rules Summary
Rule	Enforcement
One terrain per location	Config requirement
Other items only on passable terrain	Validation logic
Items resolved dynamically by type and id	Rendering logic
Maze guarantees accessible paths	Generation algorithm

📖 Note:
For the MVP, terrain icons use emojis displayed with CSS opacity for subtle visual feedback. Future versions may replace them with SVG icons and dynamic effects.

---

## ⏳ Time Model and Event Resolution (Finalized)

- **Base Time Unit**: `hours (h)`
- **Shortcuts**:  
  - `1d` = 24h  
  - `1w` = 168h  
  - `1m` = 720h  
  
### 🧮 **Total Time Calculation Formula**
```
TotalTime = PreparationTime + EventTimeToFix
```

- **PreparationTime**:  
  Time spent navigating the zone, collecting tools, and training required skills.
  - Skill training time is determined by the selected training path:
    - If `canSelfTrain` is `true`, the player may choose to self-train using `selfTrainingTime`.
    - If the player has unlocked the appropriate AI Node (listed in `aiSupport`), they can choose **short-term training** or **mastery training**, with time values taken directly from the AI Node’s `training` property (e.g., `"shortTerm": "2h"`, `"mastery": "3d"`).
  - AI Nodes do **not reduce** training times but provide distinct, predefined faster or deeper training options.
  - AI Node deployment (dataEngineeringTime, if activated)

- **EventTimeToFix**:  
  Execution time required to fix the world event, as specified directly in the `worldEvents.timeToFix`.  
  - **AI Nodes do not reduce event execution time.**

#### ✅ **Success Condition**
```
TotalTime ≤ eventTimeLimit
```
If `eventTimeLimit` is not defined, success depends solely on mission logic and harmony rewards.

---

## 📙 Harmony and Achievement Rules

### 🌟 Harmony Award Model (MVP)

In the MVP, **Harmony** represents the total restoration progress of the world. It is calculated by summing the `harmonyReward` values from completed missions and resolved world events.

```ts
player.currentHarmony = sum(completedMission.harmonyReward + resolvedEvent.harmonyReward)
```

There is **one mission and one event per zone**, and each contributes once to the total.

### 🌈 Harmony Meter

The Harmony Meter reflects global progress as a ratio:

```ts
harmonyRatio = currentHarmony / totalHarmonyPossible
```

Where `totalHarmonyPossible` is the sum of all `harmonyReward` values across every mission and event in the world config.

This approach provides a **clear, scalable, and zone-independent** progress model for MVP.

---

## 📏 Standard Time Ranges for Game Items

| **Item Type**     | **Purpose**               | **Typical Time Range**   | **Notes**                        |
|-------------------|---------------------------|--------------------------|-----------------------------------|
| **Navigation (Terrain)** | Movement between locations | `0.5h – 3h` per tile    | Based on terrain `timeCost`      |
| **Skill Training (Basic)** | Learn skill without AI     | `5h – 12h`               | Use `selfTrainingTime` property  |
| **Skill Training (With AI)** | Accelerated via AI Node  | `1h – 4h`                | Defined in `aiNode.training`     |
| **Tool Usage**    | Using tools during missions | `1h – 2h` per tool        | Simple multiplier per tool used  |
| **World Event Execution (`timeToFix`)** | Time to fix event (execution) | `4h – 24h`              | Complex events lean toward higher values |
| **World Event Limit (`eventTimeLimit`)** | Max total time (prep + exec) | `12h – 72h`             | Determines urgency/difficulty    |
| **AI Node Deployment** | Engineering/prep time | `4h – 12h`               | Based on dataEngineeringTime     |


---
### 📊 **Balancing Guide for Event Feasibility (Finalized)**

#### ✅ **1. Average Navigation Time Calculation**
```
AverageNavigationTime = AverageMoves × AverageTerrainTimeCost
```
- **AverageMoves**:  
  - Simple Maze: `8–12` moves  
  - Moderate Maze: `12–20` moves  
  - Complex Maze: `20+` moves  

- **AverageTerrainTimeCost**:  
  Example calculation based on terrain distribution:  
  ```
  (50% ground × 2h) + (30% sand × 3h) + (20% pave × 1h) = 2.3h per move
  ```
- **Example**:  
  Simple Maze → `10 moves × 2.3h = 23h` average navigation time.

#### ✅ **2. Skill Training Time Calculation**
- Required skill for the tool is *not learned*.
- Player options:
  - Self-Training (`selfTrainingTime = 6h`), if `canSelfTrain: true`.
  - AI Node Short-Term Training (`2h`).
  - AI Node Mastery Training (`3d` or `72h`).

For fast resolution, the player picks **short-term AI Node training: `2h`**.

#### ✅ **3. Event Execution Time**
- `EventTimeToFix`: `12h` (Fixed, no AI Node reduction).

#### ✅ **4. Total Time Calculation**
```
TotalTime = NavigationTime + SkillTrainingTime + EventTimeToFix
TotalTime = 23h + 2h + 12h = 37h
```
- If `eventTimeLimit = 48h`, this mission is **feasible** with some time buffer.
- If the player chose self-training (`6h`), `TotalTime = 41h` (still feasible).
- If the player insisted on mastery training (`72h`), `TotalTime = 107h` → **Not feasible within 48h**.

#### 📚 **Balancing Recommendation Table**

| Factor           | Recommendation            |
|------------------|----------------------------|
| Navigation Time  | ≤ 50% of eventTimeLimit     |
| Skill Training   | ≤ 30% of eventTimeLimit     |
| Execution Time   | Fixed by `timeToFix` value  |
| Total Time       | ≤ eventTimeLimit            |

---

## 📚 Example Validation Case: "Encroaching Kudzu" Event

#### **Event Configuration:**

```json
"worldEvents": [
  {
    "id": "event1",
    "name": "Encroaching Kudzu",
    "description": "A non-native vine has taken over a pollinator grove.",
    "icon": "🌿",
    "requiredSkills": ["skill1"],
    "requiredTools": ["tool1"],
    "timeToFix": "12h",
    "eventTimeLimit": "48h",
    "harmonyReward": 15
  }
]
```

---

#### **Step 1: Navigation Time Calculation**

* Zone is a simple maze:

  * Estimated **10 moves** required to reach the event location.
* Terrain Distribution:

  ```
  50% ground (2h), 30% sand (3h), 20% pave (1h)
  ```
* Average Terrain Time Cost:

  ```
  (0.5 × 2h) + (0.3 × 3h) + (0.2 × 1h) = 2.3h per move
  ```
* **NavigationTime**:

  ```
  10 moves × 2.3h = 23h
  ```

---

#### **Step 2: AI Node Deployment Time**

* Player chooses to activate AI Node `Cedar`, which supports short-term training for `skill1`.
* **DataEngineeringTime = 8h** (as defined in `aiNodes[]`).

---

#### **Step 3: Skill Training Calculation**

* The required skill `skill1` is not yet learned.

* Training Options:

  * Self-Training (`selfTrainingTime = 6h`), if `canSelfTrain: true`.
  * AI Node Short-Term Training (`2h`).
  * AI Node Mastery Training (`72h`).

* Player chooses **AI Node Short-Term Training: 2h** (to stay within time limits).

* **SkillTrainingTime = 2h**

---

#### **Step 4: Event Execution Time**

* `EventTimeToFix = 12h` (Fixed, no AI Node reduction).

---

#### **Step 5: Total Time Calculation**

```
TotalTime = NavigationTime + DataEngineeringTime + SkillTrainingTime + EventTimeToFix
TotalTime = 23h + 8h + 2h + 12h = 45h
```

* Event Time Limit: `48h`
* **Result**: ✔️ **Success Possible!**

---

#### 📈 **What Happens if Player Chooses Self-Training?**

```
TotalTime = 23h + 8h + 6h + 12h = 49h ❌ Too slow (1h over limit).
```

#### 📉 **What if Player Insists on Mastery Training?**

```
TotalTime = 23h + 8h + 72h + 12h = 115h ❌ Impossible within 48h.
```

---

### ✅ **Final Verdict:**

* Activating the AI Node adds a meaningful cost but enables faster training.
* AI Node support is essential if the player wants a safe margin within tight time limits.
* Mastery training is not feasible unless the event time limit is extended or the maze is optimized for faster navigation.
