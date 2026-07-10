# DESIGN_SYSTEM

Apple Tahoe + Linear + Cisco Catalyst Center.

## Visual Language

- Glass toolbar (backdrop-blur)
- Rounded cards (radius: 1.25rem)
- Soft shadows (layered: 0 12px 32px → 0 18px 56px)
- Blue accent (#007AFF light / #0A84FF dark)
- Subtle grid texture (24px, 0.035 opacity)
- Radial gradient background meshes

## Design Tokens

### Layout Tokens (CSS custom properties + TypeScript constants)

| Token | Value |
|---|---|
| `--header-height` | 64px |
| `--sidebar-width` | 260px |
| `--sidebar-width-collapsed` | 72px |
| `--sidebar-gutter` | 20px |
| `--inspector-width` | 316px |
| `--inspector-gutter` | 16px |
| `--content-padding` | 16px |
| `--page-max-width` | 1100px |

### Color Tokens

| Token | Light | Dark |
|---|---|---|
| Background | #F4F5F7 | #0E1117 |
| Sidebar | #F8F8FA | #121620 |
| Card | white / 92% | rgba(24,29,39,.86) |
| Primary | #007AFF | #0A84FF |
| Success | #34C759 | #30D158 |
| Warning | #FF9500 | #FF9F0A |
| Error | #FF3B30 | #FF453A |

### Typography

- Body: Inter, system-ui, sans-serif
- Mono: JetBrains Mono
- Base: 16px
- Headings: font-weight 600 (medium)

### Component Classes

- `.toolbar` — header/action buttons (h-9, rounded-[15px], glass bg)
- `.sidebar-title` — section headers in sidebar (text-[10px], uppercase, tracking-[0.16em])
- `.side-row` — clickable sidebar items (rounded-xl, hover accent bg)
- `.seg` / `.seg-on` — segmented control states

### Animation

- Hover: 150ms
- Layout transition: 200ms (sidebar width, content padding)
- No entrance animations on charts
