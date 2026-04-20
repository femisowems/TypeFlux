# TypeFlux ⌨️

> A high-performance, visually polished Typing Practice web app heavily inspired by monkeytype.com.

TypeFlux is engineered to deliver a seamless, zero-input-lag typing experience. Built entirely on React + Vite and leveraging **Vanilla CSS** animations, the platform avoids standard controlled-input re-render penalties to maintain buttery-smooth responsiveness.

## ✨ Core Features

*   **Ultra-Fast Typing Engine**: We bypassed heavy state-driven DOM re-renders. Every keystroke evaluates instantly without layout thrashing.
*   **Monkeytype-Level Logic**: Word boundaries, backspacing recovery, and overflowing extra characters are mapped 1-to-1 with industry standards.
*   **Smooth Animated Caret**: The typing cursor is decoupled from React renders. It reads raw DOM coordinates once and floats across characters with pure CSS interpolation.
*   **Real-time Analytics**: See your live WPM speed up as you type. Get detailed final results for Net WPM, Accuracy, and exact Keystroke errors.
*   **Premium Carbon Aesthetics**: A dark-mode centric, minimalist, distraction-free environment utilizing `JetBrains Mono`.

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
*   **Tab + Enter**: Instantly resets your session and shuffles a new deck of words (exactly like Monkeytype).

## 🗺️ Roadmap & Stretch Goals
- [ ] Sound Design: Audio feedback on correct/incorrect strokes.
- [ ] Custom Lists: Add multiple word banks (Programming syntax, Quote mode, Numbers logic).
- [ ] LocalStorage Persistence: Track your WPM progress locally across days.
- [ ] Themes Engine: Pluggable CSS custom properties that persist globally.
