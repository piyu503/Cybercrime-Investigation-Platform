from typing import Dict, List, Any

def calculate_degree_centrality(graph: Dict[str, List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
    """
    Calculates the degree centrality of all entities in the graph (excluding evidence files)
    and returns the top 5 most connected entities (the 'Hubs').
    """
    nodes = graph.get("nodes", [])
    edges = graph.get("edges", [])
    
    # We only care about entity nodes, not the files themselves
    entity_nodes = {n["id"]: n for n in nodes if n.get("group") != "evidence"}
    
    # Count connections
    connection_counts = {n_id: 0 for n_id in entity_nodes.keys()}
    
    for edge in edges:
        src = edge.get("source")
        tgt = edge.get("target")
        
        if src in connection_counts:
            connection_counts[src] += 1
        if tgt in connection_counts:
            connection_counts[tgt] += 1
            
    # Sort and get top 5
    sorted_entities = sorted(connection_counts.items(), key=lambda x: x[1], reverse=True)
    
    top_hubs = []
    for i, (node_id, count) in enumerate(sorted_entities):
        if i >= 5 or count == 0:
            break
        node_info = entity_nodes[node_id]
        top_hubs.append({
            "id": node_id,
            "label": node_info.get("label"),
            "group": node_info.get("group"),
            "degree": count,
            "reason": f"Highly connected entity ({count} direct connections)."
        })
        
    return top_hubs

def find_shortest_path(graph: Dict[str, Any], source_id: str, target_id: str) -> List[str]:
    """
    Basic BFS to find the shortest path between two nodes.
    Returns a list of node IDs forming the path, or empty list if no path.
    """
    edges = graph.get("edges", [])
    
    adjacency = {}
    for edge in edges:
        src = edge.get("source")
        tgt = edge.get("target")
        if src not in adjacency: adjacency[src] = []
        if tgt not in adjacency: adjacency[tgt] = []
        adjacency[src].append(tgt)
        adjacency[tgt].append(src)
        
    if source_id not in adjacency or target_id not in adjacency:
        return []
        
    queue = [[source_id]]
    visited = {source_id}
    
    while queue:
        path = queue.pop(0)
        node = path[-1]
        
        if node == target_id:
            return path
            
        for adjacent in adjacency.get(node, []):
            if adjacent not in visited:
                visited.add(adjacent)
                new_path = list(path)
                new_path.append(adjacent)
                queue.append(new_path)
                
    return []
