# Haptic Chart

A mobile-first showcase combining real-time animated charts with haptic feedback. Feel the market move.

## Features

- **Real-time price chart** powered by [Liveline](https://github.com/benjitaylor/liveline) — 60fps canvas-rendered animations
- **Haptic feedback** via [web-haptics](https://github.com/lochie/web-haptics) — vibration on every price change
- **Magnitude-based haptics** — bigger price swings trigger stronger feedback
- **Random timing** — organic, realistic price movements with variable pacing
- **Dark/light theme toggle**
- **Mobile-first responsive design**

## How It Works

The chart displays an endless simulated price feed. Each price update triggers haptic feedback on supported mobile devices:

| Price Change | Haptic Duration |
|--------------|-----------------|
| Small (<0.5%) | 30ms light tap |
| Medium (0.5-1%) | 50ms nudge |
| Large (>1%) | 80-120ms strong buzz |

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) on your mobile device to experience the haptic feedback.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [Liveline](https://github.com/benjitaylor/liveline) — real-time chart component
- [web-haptics](https://github.com/lochie/web-haptics) — haptic feedback library
- [Tailwind CSS v4](https://tailwindcss.com)
- TypeScript

## Project Structure

```
app/
├── page.tsx                 # Main page with theme state
├── layout.tsx               # Root layout with metadata
├── components/
│   ├── HapticChart.tsx      # Chart + haptics integration
│   └── ThemeToggle.tsx      # Dark/light theme switcher
└── hooks/
    └── usePriceSimulation.ts # Price data generator
```

## Credits

- [Liveline](https://benji.org/liveline) by Benji Taylor
- [web-haptics](https://haptics.lochie.me) by Lochie Axon

## License

MIT
