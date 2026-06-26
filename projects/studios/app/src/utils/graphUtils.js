// Helper functions to generate dependency graph layout based on prerequisites

export function generateGraphLayout(items) {
  // 1. Build an adjacency list and in-degree map
  const adjacency = {};
  const inDegree = {};
  const itemMap = new Map();

  items.forEach(item => {
    adjacency[item.id] = [];
    inDegree[item.id] = 0;
    itemMap.set(item.id, item);
  });

  // 2. Build edges based on prerequisites and recommended
  const edges = [];
  items.forEach(item => {
    const prereqs = item.prerequisites || [];
    const recs = item.recommended || [];
    
    // Add required edges
    prereqs.forEach(reqId => {
      if (itemMap.has(reqId)) {
        edges.push({ from: reqId, to: item.id });
        if (!adjacency[reqId]) adjacency[reqId] = [];
        adjacency[reqId].push(item.id);
        
        if (!adjacency[item.id]) adjacency[item.id] = [];
        adjacency[item.id].push(reqId);
        
        inDegree[item.id] = (inDegree[item.id] || 0) + 1;
      }
    });

    // Add recommended edges (dashed)
    recs.forEach(recId => {
      if (itemMap.has(recId)) {
        edges.push({ from: recId, to: item.id, dashed: true });
        if (!adjacency[recId]) adjacency[recId] = [];
        adjacency[recId].push(item.id);
        
        if (!adjacency[item.id]) adjacency[item.id] = [];
        adjacency[item.id].push(recId);
        
        // We generally don't increase in-degree for recommended edges 
        // to avoid circular dependency blocks, but let's consider it for level calculation if we want it to be placed lower.
        // For now, let's strictly use prerequisites for level calculation.
      }
    });
  });

  // 3. If there are no edges at all (strictly linear or just unconnected points)
  // Let's just create a linear sequence fallback, but if we do this, it defeats the purpose of "only map prerequisites".
  // Actually, if an item has NO prerequisites, but it's part of a sequential course, 
  // maybe we should just stack them sequentially if they have no explicit prereqs defined but have an order.
  // Wait, let's rely on the explicit prereqs. If they are unconnected, they are at level 0.

  // Let's check if the graph is completely empty (no explicit prerequisites)
  // If so, we might want to auto-link them linearly based on order_index just to have a map, or leave them at level 0?
  // Since we want the map to reflect ACTUAL dependencies, let's just lay them out.
  // But wait, if they have no prereqs, they will all be Level 0 and drawn on the same Y line. That would look weird if there are 10 items.
  // We can add a fallback: if no item has prerequisites, we assume a linear sequence.
  // If no valid edges were formed (due to missing data or mismatched IDs),
  // fallback to a linear vertical sequence.
  if (edges.length === 0 && items.length > 0) {
    // Fallback: create linear graph based on order_index
    const sorted = [...items].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
    const linearEdges = [];
    const linearNodes = [];
    const linearAdjacency = {};
    
    sorted.forEach((item, idx) => {
      linearNodes.push({
        id: item.id,
        label: item.title.split("—")[0].split(":")[0].trim().substring(0, 24),
        x: 360,
        y: 60 + idx * 130
      });
      linearAdjacency[item.id] = [];
      
      if (idx > 0) {
        const prevId = sorted[idx - 1].id;
        linearEdges.push({ from: prevId, to: item.id });
        linearAdjacency[item.id].push(prevId);
        linearAdjacency[prevId].push(item.id);
      }
    });
    return { nodes: linearNodes, edges: linearEdges, adjacency: linearAdjacency, hasBranches: false };
  }

  // 4. Calculate Levels (Topological sort approach)
  // Find nodes with 0 in-degree
  let queue = items.filter(i => inDegree[i.id] === 0).map(i => i.id);
  const levels = {};
  items.forEach(i => levels[i.id] = 0);

  // If there are circular dependencies, queue might be empty, but let's assume valid DAG
  while (queue.length > 0) {
    const currentId = queue.shift();
    const currentLevel = levels[currentId];

    // Find all nodes that depend on currentId (via strict prerequisites)
    items.forEach(item => {
      if (item.prerequisites && item.prerequisites.includes(currentId)) {
        levels[item.id] = Math.max(levels[item.id], currentLevel + 1);
        inDegree[item.id]--;
        if (inDegree[item.id] === 0) {
          queue.push(item.id);
        }
      }
    });
  }

  // 5. Group nodes by level to calculate X coordinates
  const levelGroups = {};
  let maxLevel = 0;
  items.forEach(item => {
    const lvl = levels[item.id];
    if (lvl > maxLevel) maxLevel = lvl;
    if (!levelGroups[lvl]) levelGroups[lvl] = [];
    levelGroups[lvl].push(item.id);
  });

  // Calculate coordinates
  const nodes = [];
  const svgWidth = 720;
  
  Object.keys(levelGroups).forEach(levelStr => {
    const level = parseInt(levelStr);
    const nodesInLevel = levelGroups[level];
    
    // Sort nodes in level by their order_index to keep consistent L-R ordering
    nodesInLevel.sort((a, b) => {
      const itemA = itemMap.get(a);
      const itemB = itemMap.get(b);
      return (itemA.order_index || 0) - (itemB.order_index || 0);
    });

    // Distribute X coordinates evenly
    const count = nodesInLevel.length;
    const paddingX = 120; // Minimum padding from edges
    const usableWidth = svgWidth - (paddingX * 2);
    
    nodesInLevel.forEach((nodeId, idx) => {
      let xPos = svgWidth / 2;
      if (count > 1) {
        // Space them evenly
        const step = usableWidth / (count - 1);
        xPos = paddingX + (idx * step);
      }
      
      const item = itemMap.get(nodeId);
      nodes.push({
        id: nodeId,
        label: item.title.split("—")[0].split(":")[0].trim().substring(0, 24),
        x: xPos,
        y: 60 + level * 130 // Y position based on level
      });
    });
  });

  // Determine if we have actual branching to decide if we want to show it differently
  const hasBranches = maxLevel > 0 && Object.values(levelGroups).some(group => group.length > 1);

  return { nodes, edges, adjacency, hasBranches };
}

// Function to generate bezier curve path for edges
export function generateEdgePath(x1, y1, x2, y2) {
  // If purely vertical, just return a line
  if (Math.abs(x1 - x2) < 5) {
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }
  
  // Otherwise, create a smooth bezier curve
  // Control points pull vertically first
  const curveFactor = Math.abs(y2 - y1) * 0.5;
  return `M ${x1} ${y1} C ${x1} ${y1 + curveFactor}, ${x2} ${y2 - curveFactor}, ${x2} ${y2}`;
}
