# TypeFlux ⌨️

> A high-performance, visually polished Typing Practice web application designed for a premium, distraction-free experience.

TypeFlux is engineered to deliver a seamless, zero-input-lag typing experience. Built entirely on React + Vite and leveraging **Vanilla CSS** animations, the platform avoids standard controlled-input re-render penalties to maintain buttery-smooth responsiveness.

## ✨ Core Features

*   **Ultra-Fast Typing Engine**: We bypassed heavy state-driven DOM re-renders. Every keystroke evaluates instantly without layout thrashing.
*   **Precision Logic**: Professional-grade word boundaries, backspacing recovery, and overflowing extra characters support.
*   **Smooth Animated Caret**: The typing cursor is decoupled from React renders. It reads raw DOM coordinates once and floats across characters with pure CSS interpolation.
*   **Quick Settings Bar**: Effortlessly switch between modes (Time, Words, Facts), durations, and toggles (Punctuation, Numbers, Zen Mode) with a single click.
*   **History Facts Mode**: Type interesting historical facts and biographical snippets while intentionally hiding performance counters to focus on learning.
*   **Premium Themes**: Multi-theme support (Carbon, Dracula, Matrix, Nord) with instant switching and glassmorphic UI elements.
*   **Soundscapes**: Immersive mechanical keyboard audio feedback with custom switch types (Blue, Brown, Red).

## 🏗️ Technical Architecture

### Tech Stack
*   **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: Pure Vanilla CSS (Zero CSS libraries, preserving 100% control over micro-animations and repaints).

### Performance Logic (`useTypingEngine.ts`)
Instead of an `<input value={state}>` acting as a single source of truth that triggers root re-renders, the web application relies on a **global KeyDown listener** and granular `memo()` optimization for individual `Word` bounds.
1. `document.addEventListener('keydown')` feeds raw keys cleanly.
2. The `Caret` component reads the absolute coordinates directly from the rendered active `word/span` on the page instead of holding pixel states. This forces a rapid CSS animate `transform/left` while ignoring heavier JS computations.
3. WPM logic adheres precisely to standard calculation algorithms: `Raw WPM = (typed / 5) / time` while `Net WPM = (correct / 5) / time`.

## 🚀 Running Locally

### Prerequisites
*   Node.js (`v20+` recommended)
*   NPM / Yarn / pnpm

### Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the local development server:**
   ```bash
   npm run dev
   ```
   *Your app will launch on `http://localhost:5173`.*

3. **Build for Production:**
   ```bash
   npm run build
   ```

## ⌨️ Controls
*   **Type**: Just start typing! (App listens globally)
*   **Tab + Enter**: Instantly resets your session and shuffles a new deck of words.
*   **Cmd + K**: Open the Command Palette for advanced configuration and themes.

## 🗺️ Progress
- [x] **Sound Design**: Audio feedback on correct/incorrect strokes with multiple switch types.
- [x] **Custom Lists**: Support for Code, React, Git, CSS, and General History Facts.
- [x] **Themes Engine**: Pluggable CSS custom properties (Carbon, Dracula, Matrix, Nord).
- [x] **Quick Menu**: Clickable header settings for fast configuration.
- [x] **Persistence**: All configurations and local history are tracked via LocalStorage.
