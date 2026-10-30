# VectorShift Backend — Pipeline Analysis API

A lightweight, high-performance FastAPI service designed to analyze visual node-based workflows, validate pipeline topologies, count nodes/edges, and verify Directed Acyclic Graph (DAG) integrity.

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.9+
- `pip`

### 2. Setup Virtual Environment (Recommended on macOS)

On macOS / Homebrew Python, use a virtual environment:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

*(Alternatively, to install directly without a virtual environment)*:
```bash
pip3 install -r requirements.txt --break-system-packages
```

### 3. Run the Development Server

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The server will start at:
- **API URL**: `http://127.0.0.1:8000`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

---

## 📡 API Endpoints

### 1. `GET /` — Health Check
Verifies that the backend API is active.

- **Response**:
  ```json
  {
    "Ping": "Pong"
  }
  ```

---

### 2. `POST /pipelines/parse` — Analyze Pipeline Topology
Parses the current state of the pipeline canvas, counts total nodes and edges, and checks for circular dependencies.

- **Request Headers**:
  - `Content-Type: application/json`

- **Request Body**:
  ```json
  {
    "nodes": [
      { "id": "customInput-1", "type": "customInput" },
      { "id": "llm-1", "type": "llm" },
      { "id": "customOutput-1", "type": "customOutput" }
    ],
    "edges": [
      { "source": "customInput-1", "target": "llm-1" },
      { "source": "llm-1", "target": "customOutput-1" }
    ]
  }
  ```

- **Response Body**:
  ```json
  {
    "num_nodes": 3,
    "num_edges": 2,
    "is_dag": true
  }
  ```

*(Also supports `application/x-www-form-urlencoded` and `multipart/form-data` with `pipeline={...}` for backwards compatibility).*

---

## 🧠 DAG Verification Algorithm (Kahn's Algorithm)

The backend determines whether the pipeline forms a valid Directed Acyclic Graph (DAG) using **Kahn's Topological Sorting Algorithm**:

1. **Calculate In-Degrees**: Computes the number of incoming edges for every node.
2. **Identify Roots**: Collects all nodes with `in_degree == 0` (nodes that have no dependencies).
3. **Queue-Based Traversal**:
   - Dequeues each node.
   - For every outgoing edge to a neighbor, decrements the neighbor's `in_degree`.
   - When a neighbor's `in_degree` reaches 0, enqueues it.
4. **Cycle Detection**:
   - If the total count of visited nodes equals the total number of unique nodes in the graph, **no cycles exist (`is_dag: true`)**.
   - If unvisited nodes remain, they are trapped in a circular dependency (**`is_dag: false`**).

---

## 🖥 Terminal Logging

`main.py` provides real-time logging for every request:
- Timestamped logs of incoming requests and Content-Type.
- Node IDs and directed edge pairs identified.
- Step-by-step traversal log of visited nodes and in-degree decrements.
- Clear `[INFO]` confirmation when a DAG is valid or `[WARNING]` highlighting circular cycles.

---

## 📂 Project Structure

```text
backend/
├── main.py              # FastAPI application & DAG analysis logic
├── requirements.txt     # Python package dependencies
└── venv/                # Local virtual environment (ignored by git)
```

