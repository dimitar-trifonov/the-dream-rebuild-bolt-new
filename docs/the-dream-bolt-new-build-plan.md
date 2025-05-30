# The Dream – Bolt.new Frontend Build Plan (MVP)

## ✯ Goal

Create a playable, frontend-only prototype that supports:

* Choosing a **life goal**
* Viewing and exploring the **world zones**
* Interacting with **missions, skills, tools**, and **AI Nodes**
* Tracking progress via a **Harmony score**

---

## 🛡️ 1. Project Structure

```
/src
  /data         ← static config JSONs (world, missions, skills, etc.)
  /services     ← LocalDataService, PromptService (fake backend)
  /components   ← Reusable UI parts (ZoneCard, MissionCard, NodeDialogue, etc.)
  /pages        ← Page-level views (ChooseGoal, WorldMap, MissionView, etc.)
  /hooks        ← usePlayerProfile(), useGameData()
  /state        ← Context or Zustand store for PlayerProfile
  /assets       ← Icons, illustrations, background
```

---

## 📒 2. Key Pages to Build

| Page             | Features                                            |
| ---------------- | --------------------------------------------------- |
| `/` (Home)       | Game intro, “New Game” button                       |
| `/choose-goal`   | Pick “Restore Nature” or “Rebuild Community Trust”  |
| `/map`           | Visual map of 5 zones; click to open missions       |
| `/zone/:id`      | Zone view: missions list + current state            |
| `/mission/:id`   | Mission details, tools/skills needed, start mission |
| `/inventory`     | Skills learned, tools unlocked                      |
| `/ai-node`       | Simulate AI Node conversation / reflection          |
| `/hud` (overlay) | Harmony score, current location, active goal        |

---

## 🧠 3. Core Systems to Implement

| System                | Strategy                                           |
| --------------------- | -------------------------------------------------- |
| `PlayerProfile`       | Store in React Context or Zustand                  |
| `LocalDataService.ts` | Load JSON files for missions, skills, zones        |
| `PromptService.ts`    | Optional static prompt loading (future: LLM calls) |
| `ActionLog`           | Track player choices and mission completions       |
| `HarmonyScore`        | Calculate based on mission rewards                 |

---
## 🗂️ 4. Data Implementation Tasks

- Design and implement a source-agnostic `useGameData()` hook
- Load static data from `example-world-config.json` initially
- Support config reset or reload via `window.dispatchEvent(new Event("config:reload"))`
- Use context (`GameDataContext`) to share current world/zone/state
- Make all page-level components (map, zone, mission) pull only from the hook
- Ensure all harmony/time rules are derived from config, not hardcoded
- Future-proof with ability to swap in remote or live data sources later

---

## 🧪 5. First Build Milestone

> ✯ Goal: Working flow from goal → map → zone → mission → mission complete

1. ✅ Load static JSON config (e.g., `src/config/the-dream-game-config.json`)
2. ✅ Choose goal → set in PlayerProfile
3. ✅ Show zone map with mission counts
4. ✅ View zone → see missions → start one
5. ✅ Complete mission → gain Harmony → unlock tool or skill
6. ✅ Optional: reflect with AI Node (pre-written or simulated)

---

## 🚀 6. Future Expansion Paths (Post-MVP)

| Feature                        | Add When Ready                                      |
| ------------------------------ | --------------------------------------------------- |
| 🧠 Real LLM API calls          | Swap PromptService to fetch missions or reflections |
| ↺ Dynamic random events        | Use random event model to disrupt missions          |
| 🛁 Procedural world generation | Use one meta prompt to generate a new config        |
| 🥱️ Multiplayer zones          | Track and compare world healing in real-time        |
