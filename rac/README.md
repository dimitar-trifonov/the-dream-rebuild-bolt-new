# 📘 The Dream — RaC System Overview (MVP)

This README provides an overview of the Requirements as Code (RaC) architecture used to implement **The Dream**, a goal-driven restoration game powered by frontend-only logic and LLM support.

---

## 🧱 RaC Folder Structure

```text
/rac/
├── app.rac.yaml               # Main app definition and config
├── ui/                        # UI binding logic (pages, components)
├── state/                     # In-memory data structures
├── events/                    # Declarative user actions
├── logic/                     # Game mechanics and rules
├── data/                      # Game structure schemas and formats
├── content/                   # Static prompts and world text
├── css/                       # Theme, color, animation tokens
├── tests/                     # Simulation-driven validations
```

---

## 🌍 MVP Game Concepts

This RaC implementation is custom-tailored for *The Dream*, but the structure is reusable.

### Key Entities
- **PlayerProfile**: Tracks goal, skills, tools, and progress
- **WorldState**: Tracks zones, events, and harmony status
- **Mission/Event**: Themed challenges to be fixed by time-limited interaction

### Event Modeling
Each action is a structured YAML file:
- `trigger`: what user does (e.g. clicks button)
- `conditions`: pre-checks for enabling action
- `actions`: what the app changes (state, logs, rewards)

### Examples:
- `start-mission.rac.yaml`
- `collect-tool.rac.yaml`
- `train-skill.rac.yaml`

---

## 🔧 Custom + Reusable Design

| Layer           | Reusable? | Notes |
|----------------|-----------|-------|
| Folder Layout  | ✅        | Works across apps
| RaC File Types | ✅        | UI, state, events, logic
| Entity Names   | ❌        | Custom: tools, AI nodes, harmony
| Conditions     | ❌        | Domain-specific: time limits, skills

Use this RaC model as a **template** for any world-based, time-driven, decision-based simulation app.

---

## ✅ Getting Started with Bolt.new

Use each `.rac.yaml` file to:
- Auto-generate UI (via UI RaC)
- Validate logic (via tests)
- Prompt for component or flow creation

Prompt example:
```bash
"Create the UI page based on /rac/ui/zone-view.rac.yaml. Use Tailwind and Dream's design system."
```

---

## 🚀 Extend or Reuse

This RaC architecture can be ported to:
- New educational games
- AI-assisted habit trackers
- Interactive training apps

Just update:
- Entities in `state/`
- Actions in `events/`
- Logic in `logic/`

---

**Built with empathy, modularity, and growth in mind.**
---

## 🗺️ Visual Sitemap (Markdown Overview)

```text
The Dream
├── Home (/)
├── Design System (/design)
├── Config (/config)
├── Inventory (/inventory)
├── Choose Goal (/choose-goal)
│   └── /zone/:id → Zone View
│       ├── player-profile.rac.yaml
│       ├── world-state.rac.yaml
│       ├── zone-navigation.rac.yaml
│       ├── harmony-system.rac.yaml
│       └── world-data (game-structure.rac.yaml)
└── Mission Detail (/mission/:id)

Supporting Layers:
- css/
  - design-system
  - animations
- content/
  - about
  - world-prompts
- tests/
  - harmony-system.test
  - zone-accessibility.test
  - player-profile.test
  - user-profile-page.test
```

This sitemap shows how UI routes and gameplay logic connect through RaC components.

