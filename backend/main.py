# main.py - VectorShift Backend Pipeline Parser with Detailed Logging

import logging
import json
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

# Configure logging format and level
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("pipeline_parser")

app = FastAPI(title="VectorShift Pipeline Parser")

# Enable CORS so the React frontend (running on port 3000) can communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def check_is_dag(nodes: list, edges: list) -> bool:
    """
    Checks whether the graph is a Directed Acyclic Graph (DAG) using Kahn's algorithm:
    1. Count incoming edges (in-degree) for each node.
    2. Start with nodes having in-degree 0.
    3. Remove edges from visited nodes and repeat.
    4. If all nodes are visited, there are no cycles -> It is a DAG.
    """
    node_ids = set()

    # Collect all unique node IDs from nodes list
    for node in nodes:
        node_id = node.get("id") if isinstance(node, dict) else str(node)
        if node_id:
            node_ids.add(node_id)

    # Also register any nodes referenced in edges
    for edge in edges:
        src = edge.get("source") if isinstance(edge, dict) else None
        tgt = edge.get("target") if isinstance(edge, dict) else None
        if src:
            node_ids.add(src)
        if tgt:
            node_ids.add(tgt)

    logger.info(f"Nodes identified ({len(node_ids)}): {list(node_ids)}")

    if edges:
        edge_summary = [
            f"{e.get('source')} -> {e.get('target')}"
            for e in edges
            if isinstance(e, dict)
        ]
        logger.info(f"Edges identified ({len(edges)}): {', '.join(edge_summary)}")
    else:
        logger.info("Edges identified (0): None")

    # An empty graph or single node is trivially a DAG
    if not node_ids:
        logger.info("Graph is empty -> Trivially a DAG: True")
        return True

    # Build adjacency list (directed edges) and in-degree counter
    adj = {n_id: [] for n_id in node_ids}
    in_degree = {n_id: 0 for n_id in node_ids}

    for edge in edges:
        src = edge.get("source") if isinstance(edge, dict) else None
        tgt = edge.get("target") if isinstance(edge, dict) else None
        if src and tgt and src in adj and tgt in in_degree:
            adj[src].append(tgt)
            in_degree[tgt] += 1

    logger.info(f"Initial in-degrees (incoming arrows): {in_degree}")

    # Queue of nodes that have 0 incoming edges (starting points)
    queue = [n_id for n_id, deg in in_degree.items() if deg == 0]
    logger.info(f"Starting nodes with in-degree 0: {queue}")

    visited_count = 0

    # Process nodes level by level
    while queue:
        curr = queue.pop(0)
        visited_count += 1
        logger.info(f"  Visiting node '{curr}' (total visited so far: {visited_count})")

        for neighbor in adj[curr]:
            in_degree[neighbor] -= 1
            logger.info(f"    Decremented in-degree for '{neighbor}' to {in_degree[neighbor]}")
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                logger.info(f"    Node '{neighbor}' reached 0 in-degree -> Added to queue")

    is_dag = visited_count == len(node_ids)
    if is_dag:
        logger.info(f"DAG Check Result: TRUE (Visited all {visited_count}/{len(node_ids)} nodes - no cycles detected)")
    else:
        logger.warning(
            f"DAG Check Result: FALSE (Only visited {visited_count}/{len(node_ids)} nodes - circular cycle detected!)"
        )

    return is_dag


@app.get('/')
def read_root():
    logger.info("Received request on GET / (Healthcheck Ping)")
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse')
async def parse_pipeline(request: Request):
    """
    Receives pipeline nodes and edges, counts them,
    and returns {num_nodes, num_edges, is_dag}.
    Supports both JSON request body and form data.
    """
    logger.info("==================================================")
    logger.info("Received request on POST /pipelines/parse")

    nodes = []
    edges = []

    content_type = request.headers.get("content-type", "")
    logger.info(f"Incoming Content-Type: {content_type}")

    # Handle JSON request body: {"nodes": [...], "edges": [...]}
    if "application/json" in content_type:
        try:
            body = await request.json()
            nodes = body.get("nodes", [])
            edges = body.get("edges", [])
            logger.info(f"Successfully parsed JSON body with {len(nodes)} nodes and {len(edges)} edges")
        except Exception as e:
            logger.error(f"Error parsing JSON body: {e}")
    # Handle Form data: pipeline=...
    elif "application/x-www-form-urlencoded" in content_type or "multipart/form-data" in content_type:
        try:
            form = await request.form()
            pipeline_raw = form.get("pipeline")
            if pipeline_raw:
                parsed = json.loads(pipeline_raw)
                nodes = parsed.get("nodes", [])
                edges = parsed.get("edges", [])
                logger.info(f"Successfully parsed Form data with {len(nodes)} nodes and {len(edges)} edges")
        except Exception as e:
            logger.error(f"Error parsing Form data: {e}")
    else:
        # Fallback attempt to parse as JSON
        try:
            body = await request.json()
            nodes = body.get("nodes", [])
            edges = body.get("edges", [])
            logger.info(f"Fallback: parsed JSON body with {len(nodes)} nodes and {len(edges)} edges")
        except Exception as e:
            logger.error(f"Fallback parsing failed: {e}")

    num_nodes = len(nodes)
    num_edges = len(edges)

    # Perform DAG verification
    is_dag = check_is_dag(nodes, edges)

    response_data = {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag
    }

    logger.info(f"Sending response back to frontend: {response_data}")
    logger.info("==================================================")

    return response_data


# Backwards compatibility for GET requests
@app.get('/pipelines/parse')
def parse_pipeline_get():
    logger.info("Received request on GET /pipelines/parse (legacy)")
    return {'status': 'parsed'}
