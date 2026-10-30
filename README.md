# VectorShift — Full Stack Technical Assessment

A full-stack workflow and pipeline orchestration platform built for the **VectorShift Technical Assessment**, consisting of a modern **React Flow** frontend and a **FastAPI** backend with Directed Acyclic Graph (DAG) validation.

---

## 📋 Assessment Checklist & Implementation Summary

| Part | Requirement | Implementation Details | Status |
| :--- | :--- | :--- | :---: |
| **Part 1** | **Node Abstraction** | Created reusable [`BaseNode`](file:///Users/jatinsharma/Downloads/frontend_technical_assessment/frontend/src/nodes/baseNode.js) wrapper handling headers, card styling, auto-spaced handles, and node deletion. Added 5 automation nodes: `HTTP Request`, `Condition`, `JSON Transform`, `Merge`, and `Webhook`. | ✅ Complete |
| **Part 2** | **Styling** | Implemented VectorShift's warm editorial aesthetic (`#F7F4EC` / `#FBFAF5`), 64px header, 260px categorized sidebar, sleek smoothstep edges, square controls, and custom dark buttons. | ✅ Complete |
| **Part 3** | **Text Node Logic** | Built dynamic auto-resizing width (`220px - 420px`) and height (`100px - 320px`). Automatically extracts `{{ variableName }}` with JS identifier regex and generates dynamic target handles on the left. | ✅ Complete |
| **Part 4** | **Backend Integration** | Implemented `POST /pipelines/parse` in FastAPI. Computes node/edge counts, validates DAG using Kahn's algorithm, enables CORS, and triggers a user-friendly alert and result modal on the frontend. | ✅ Complete |

---

## 🏛 Project Architecture

```text
frontend_technical_assessment/
├── README.md                          # Main project documentation (this file)
│
├── backend/                           # Python / FastAPI Backend
│   ├── main.py                        # FastAPI endpoints, CORS, & Kahn's DAG algorithm
│   ├── requirements.txt               # Backend dependencies (fastapi, uvicorn)
│   └── README.md                      # Backend setup and API documentation
│
└── frontend/                          # React / React Flow Frontend
    ├── package.json                   # React project dependencies
    ├── README.md                      # Frontend component and design documentation
    ├── public/
    │   └── index.html                 # HTML template with Google Fonts (Inter, Newsreader)
    └── src/
        ├── App.js                     # Header and two-column layout
        ├── draggableNode.js           # Sidebar node picker tiles
        ├── toolbar.js                 # 260px Left Sidebar with 5 categorized sections
        ├── ui.js                      # React Flow canvas, dot grid, minimap, & controls
        ├── store.js                   # Zustand store (nodes, edges, node deletion, updates)
        ├── submit.js                  # Analyze button, API call, alert & result modal
        ├── index.css                  # VectorShift design system & color tokens
        └── nodes/
            ├── baseNode.js            # Unified BaseNode abstraction wrapper
            ├── baseNode.css           # Node card, header, input, and handle styling
            ├── inputNode.js           # Trigger Input Node
            ├── webhookNode.js         # Webhook Trigger Node
            ├── llmNode.js             # LLM Inference Node
            ├── textNode.js            # Auto-resizing Text Node with {{ var }} handles
            ├── httpRequestNode.js     # HTTP Request Node
            ├── jsonTransformNode.js   # JSON Transform Node
            ├── ifNode.js              # Condition (True/False) Branching Node
            ├── mergeNode.js           # Merge Node (Multiple Inputs)
            └── outputNode.js          # Pipeline Output Sink Node
```

---

## 🚀 Getting Started

To run the complete application, start both the backend and frontend servers:

### 1. Start the Backend (FastAPI)

```bash
cd backend

# Create and activate virtual environment (recommended on macOS)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server with live reload
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
- API is live at: `http://127.0.0.1:8000`
- Interactive API Docs: `http://127.0.0.1:8000/docs`

---

### 2. Start the Frontend (React)

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```
- App will open automatically at: `http://localhost:3000`

---

## 🧪 How to Test the Features

### 1. Test Node Creation & Abstraction
1. Drag any node from the left sidebar onto the canvas (e.g. `Input`, `LLM`, `Output`, `HTTP Request`, `Condition`, `Merge`).
2. Notice the consistent header layout, category accent dot, and clean input controls.

### 2. Test Node Deletion
- **Via Button**: Hover over any node and click the `✕` delete button in the top-right of its header.
- **Via Keyboard**: Click any node to select it, then press <kbd>Backspace</kbd> or <kbd>Delete</kbd>.
- In both cases, the node and all connected edges are cleanly removed.

### 3. Test Dynamic Text Node Logic
1. Drag a `Text` node onto the canvas.
2. Type text containing variables, e.g.:
   ```text
   Hello {{ firstName }}, your order {{ orderId }} is ready!
   ```
3. **Dynamic Handles**: Notice target handles automatically appear on the left for `{{ firstName }}` and `{{ orderId }}`.
4. **Auto-Resize**: Add longer sentences or multiple lines; notice the node container width and height expand automatically.

### 4. Test Backend Integration & DAG Validation
1. Create a valid pipeline: `Input` ➔ `LLM` ➔ `Output`.
2. Click **"Analyze Pipeline"** at the bottom center.
3. The frontend sends the graph to `POST /pipelines/parse`, and an alert displays:
   ```text
   📊 Pipeline Analysis Result:

   • Number of Nodes: 3
   • Number of Edges: 2
   • Is a DAG: Yes (Valid Acyclic Graph)
   ```
4. A minimal enterprise modal dialog also appears with metric cards.
5. **Cycle Detection**: Create a loop (e.g. `A` ➔ `B` ➔ `C` ➔ `A`). Click **"Analyze Pipeline"**; the backend correctly flags:
   ```text
   Is a DAG: No (Contains Cycles)
   ```

---

## 🛠 Tech Stack

- **Frontend**: React 18, React Flow 11, Zustand 4
- **Backend**: FastAPI, Uvicorn, Pydantic, Python 3.9+
- **Styling**: Pure CSS design tokens conforming to VectorShift visual specifications

