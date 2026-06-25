from typing import List, Dict, Any

def build_knowledge_graph(files: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    """
    Constructs an in-memory knowledge graph from structured evidence.
    Returns {"nodes": [...], "edges": [...]} suitable for D3/Vis.js visualization.
    """
    nodes = {}
    edges = []

    for file_obj in files:
        if not file_obj.get("is_processed"):
            continue

        processed_data = file_obj.get("processed_data", {})
        entities = processed_data.get("entities", {})
        confidences = entities.get("confidence", {})
        filename = file_obj.get("filename", "Unknown File")
        
        # 1. Create a node for the Evidence File itself
        file_node_id = f"file::{filename}"
        if file_node_id not in nodes:
            nodes[file_node_id] = {
                "id": file_node_id,
                "label": filename,
                "group": "evidence",
                "confidence": 1.0
            }

        # 2. Extract entity nodes and link them to the Evidence File
        entity_groups = {
            "persons": "person",
            "phones": "phone",
            "vehicles": "vehicle",
            "locations": "location",
            "dates": "date",
            "times": "time",
            "organizations": "organization",
            "emails": "email",
            "money": "money",
            "evidence_ids": "evidence_id"
        }

        file_entities = []

        for dict_key, group_name in entity_groups.items():
            items = entities.get(dict_key, [])
            for item in items:
                # Ensure node uniqueness by group+value
                node_id = f"{group_name}::{item}"
                conf = confidences.get(item, 0.5)

                if node_id not in nodes:
                    nodes[node_id] = {
                        "id": node_id,
                        "label": item,
                        "group": group_name,
                        "confidence": conf
                    }
                else:
                    # Update confidence if higher
                    if conf > nodes[node_id]["confidence"]:
                        nodes[node_id]["confidence"] = conf

                file_entities.append(node_id)

                # Edge: Entity -> Evidence File (mentioned_in)
                edges.append({
                    "source": node_id,
                    "target": file_node_id,
                    "label": "mentioned_in",
                    "confidence": conf,
                    "evidence_file": filename
                })

        # 3. Create edges between entities found in the same file (co-occurrence)
        # To avoid explosive edge creation, we only link Person to other distinct entities
        # or Phone to Person, etc. Simple rule: link Persons to everything else in the file.
        persons_in_file = [e for e in file_entities if e.startswith("person::")]
        other_entities = [e for e in file_entities if not e.startswith("person::")]

        for person in persons_in_file:
            for other in other_entities:
                group = other.split("::")[0]
                label = "related_to"
                if group == "phone":
                    label = "owns_phone"
                elif group == "vehicle":
                    label = "owns_vehicle"
                elif group == "location":
                    label = "visited"
                elif group == "organization":
                    label = "associated_with"

                edges.append({
                    "source": person,
                    "target": other,
                    "label": label,
                    "confidence": min(nodes[person]["confidence"], nodes[other]["confidence"]),
                    "evidence_file": filename
                })

    return {
        "nodes": list(nodes.values()),
        "edges": edges
    }
