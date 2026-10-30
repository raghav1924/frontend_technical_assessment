# VectorShift Frontend — Pipeline Studio

A visual workflow and pipeline builder built with **React**, **React Flow**, and **Zustand**, styled in a minimalist editorial aesthetic inspired by the VectorShift product design language.

---

## 🎨 Design System & Visual Philosophy

- **Color Palette**: Warm neutral canvas (`#F7F4EC`), crisp surface cards (`#FBFAF5`), deep obsidian text and accents (`#111318`), and subtle borders (`#D8D5CC` / `#BDB9AF`).
- **Restrained Accents**: Category-specific color accents for easy scanning without visual clutter:
  - `Triggers`: `#7C83FD` / `#84CC16`
  - `AI`: `#A78BFA` / `#C084FC`
  - `Data`: `#60A5FA` / `#14B8A6`
  - `Logic`: `#F59E0B` / `#EC4899`
  - `Output`: `#34D399`
- **Typography**: Clean sans-serif (`Inter`) for controls, section tracking labels, and serif italics for editorial headlines.

---

## 🧱 Component Architecture

```text
frontend/src/
├── App.js                     # Header, 2-column layout (sidebar + canvas), and status bar
├── draggableNode.js           # Draggable node picker tiles with category accents
├── toolbar.js                 # 260px Left Sidebar categorized into Triggers, AI, Data, Logic, Output
├── ui.js                      # React Flow canvas, grid, minimap, controls, and connection handlers
├── store.js                   # Zustand global store managing nodes, edges, changes, and deletions
├── submit.js                  # "Analyze Pipeline" action, backend integration, alert & result modal
├── index.css                  # Global styles, variables, typography, and ReactFlow overrides
└── nodes/
    ├── baseNode.js            # Unified BaseNode abstraction wrapper
    ├── baseNode.css           # Styling for node cards, headers, form controls, and handles
    ├── inputNode.js           # Trigger input node
    ├── webhookNode.js         # Webhook trigger node
    ├── llmNode.js             # LLM inference node
    ├── textNode.js            # Dynamic auto-resizing text node with {{ variable }} detection
    ├── httpRequestNode.js     # External HTTP REST API request node
    ├── jsonTransformNode.js   # JSON payload transformation node
    ├── ifNode.js              # Condition branching node (True / False outputs)
    ├── mergeNode.js           # Multiple input merging node
    └── outputNode.js          # Pipeline output sink node
```

---

## ⚡ Key Features

### 1. `BaseNode` Abstraction
All nodes share a common abstraction ([`baseNode.js`](file:///Users/jatinsharma/Downloads/frontend_technical_assessment/frontend/src/nodes/baseNode.js)):
- **Consistent Wrapper**: Standardized header (42px), title, category accent dot, and body.
- **Dynamic Handle Management**: Automatically scopes handle IDs to the node and evenly distributes multiple handles vertically when offsets are omitted.
- **Node Deletion**: Integrated `✕` delete button on the header of every node (plus keyboard <kbd>Backspace</kbd> / <kbd>Delete</kbd> support) that cleanly prunes all connected edges.

### 2. Special Dynamic Text Node
- **Auto-Resizing**: Both container width (`220px - 420px`) and height (`100px - 320px`) expand dynamically based on line length and line count.
- **Variable Handle Generation**: Automatically matches `{{ variableName }}` with JavaScript identifier validation, deduplicates variables, and generates dynamic target handles on the left.

### 3. Pipeline Analysis Action
- Floating bottom-center **"Analyze Pipeline"** button.
- Submits graph data to the FastAPI backend at `http://127.0.0.1:8000/pipelines/parse`.
- Displays a user-friendly browser alert and a minimal enterprise result dialog with node counts, edge counts, and DAG status.
- Includes a client-side Kahn's algorithm fallback if the backend server is temporarily offline.

---

## 🛠 Running the Application

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start the Development Server
```bash
npm start
```
Runs the app at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```
Generates an optimized, minified production bundle in the `build/` folder.

---

## ⌨️ Shortcuts & Interactions
- **Drag & Drop**: Drag any node from the left sidebar onto the canvas.
- **Pan / Zoom**: Scroll to zoom, drag empty canvas to pan.
- **Connect Nodes**: Drag from any right handle (source) to any left handle (target).
- **Delete Nodes**: Click `✕` in the node header or select a node and press <kbd>Backspace</kbd> / <kbd>Delete</kbd>.
- **Analyze**: Click **"Analyze Pipeline"** at the bottom center to evaluate the pipeline.
