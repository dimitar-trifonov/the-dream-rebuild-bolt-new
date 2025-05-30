
# 🎨 The Dream — Design System Compatibility Checklist

This file ensures that every component, page, and style generated for *The Dream* remains visually and emotionally aligned with the core themes: **hope, healing, and human-AI collaboration**.

---

## ✅ Color & Contrast Guidelines

- [x] Use **soft greens, muted blues, parchment beige, and gentle rose tones**.
- [x] Maintain **WCAG-compliant contrast** for all text against zone/map backgrounds.
- [x] Button hover/active states should be **subtle, not jarring**.

### 🎨 Tailwind Color Tokens (with aliases)

| Purpose           | Tailwind Token             |
|-------------------|----------------------------|
| Background        | `bg-dream-bg`              |
| Zone Card BG      | `bg-dream-zone-bg`         |
| Primary Button    | `bg-dream-primary`         |
| Secondary Button  | `bg-dream-secondary`       |
| Alert/Emotion     | `bg-dream-contrast`        |
| HUD Feedback      | `bg-harmony-high`, `-mid`, `-low` |

These tokens map to underlying HSL variables declared via `--leaf-*`, `--soil-*`, `--dream-*`, and `--dawn-*`. Use them consistently in class names.

---

## ✅ Typography & Scale

- [x] Use a **clear hierarchy**:
  - Titles: `text-4xl` (`dream-title`)
  - Section headers: `text-2xl`
  - Body text: `text-base`
  - Small info: `text-sm`
- [x] Fonts: `narrative` for expressive content, `interface` for UI clarity

---

## ✅ Component Style Presets

### 🧱 Cards

```html
<div class="bg-dream-zone-bg p-4 rounded-2xl shadow-md">...</div>
```

### 🔘 Buttons

```html
<button class="bg-dream-primary hover:bg-dream-primary-hover text-white px-4 py-2 rounded-lg transition">
  Start Mission
</button>
```

### 🌫️ Overlays

```html
<div class="bg-white bg-opacity-80 backdrop-blur-md shadow-lg p-4 rounded-xl">Overlay</div>
```

---

## ✅ Animation & Motion

Use subtle, natural-feeling motion effects to support emotional pacing:

| Class             | Purpose                          |
|-------------------|----------------------------------|
| `animate-growth`  | Enter/confirm UI, growth themes  |
| `animate-sway`    | Natural world ambience           |
| `animate-pulse-subtle` | Passive feedback, not alerts   |

---

## ✅ Emotional Tone Reminder

> All visuals must reflect:
> - **Gentleness** over urgency  
> - **Care** over control  
> - **Restoration** over performance  

Avoid:
- Harsh contrast
- Sharp edges or drop shadows
- High-saturation neon tones
- Overly technical or gamified styles

---

## 🧪 Prompt Usage Tip

When prompting Bolt.new for UI components, **reference this file** with:

> “Use styles from `design-system-compatibility.md` to match *The Dream*’s visual tone.”

This ensures LLM consistency across sessions.

---

## 📁 File Location Recommendation

- Store as: `docs/design-system-compatibility.md` or `src/theme/design-system.md`