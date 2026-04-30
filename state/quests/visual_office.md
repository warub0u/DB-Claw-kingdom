# Visual Office - Pixel Art Map Component

## Overview
A pixel art styled office map showing party members at their stations. Dashboard component for Mission Control.

## Layout (8x8 Grid)
```
┌────────────────────────────────┐
│     THE BUTLER'S HAVEN         │
├──────┬──────┬──────┬───────────┤
│ 🛡️   │ 🔮   │ 🎭   │ ⚙️        │
│Chief │ Sage │ Bard│Artificer  │
├──────┴──────┴──────┴───────────┤
│         CONSOLE OUTPUT         │
│    (Activity Log Display)      │
├────────────────────────────────┤
│         MARKET STATUS          │
│    (NLV, Capital, ROI)         │
└────────────────────────────────┘
```

## Stations

### Chief of Staff (Paladin)
- Position: Top-left
- Icon: 🛡️
- Color: #FFD700 (gold)
- Shows: Active workflows count

### The Sage (Mage)  
- Position: Top-center
- Icon: 🔮
- Color: #8B5CF6 (purple)
- Shows: Market status, valuations

### The Bard (Writer)
- Position: Top-right
- Icon: 🎭
- Color: #FF006E (pink)
- Shows: Content pipeline status

### The Artificer (Coder)
- Position: Top-right-right
- Icon: ⚙️
- Color: #00F5FF (cyan)
- Shows: System health

## Interactions
- Hover station: Show agent details tooltip
- Click station: Expand agent status panel
- Status colors: Green (active), Yellow (idle), Red (error)

## CSS Implementation
```css
.pixel-art {
  image-rendering: pixelated;
  font-family: 'VT323', monospace;
}
.grid-office {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
}
.station {
  border: 2px solid var(--station-color);
  padding: 8px;
  background: rgba(0,0,0,0.8);
}
```

## Next Steps
1. Create React component
2. Add to Mission Control dashboard
3. Wire up real-time status
