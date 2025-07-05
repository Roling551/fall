export function dijkstra<T>(
  getNeighbors: (node: T) => T[],
  getWeight: (from: T, to: T) => number,
  start: T,
  end: T,
  includeFirst = false
): { distance: number; path: T[] } | null {
  const distances = new Map<T, number>();
  const previous = new Map<T, T | null>();
  const visited = new Set<T>();
  const priorityQueue: [T, number][] = [];

  distances.set(start, 0);
  previous.set(start, null);
  priorityQueue.push([start, 0]);

  while (priorityQueue.length > 0) {
    priorityQueue.sort((a, b) => a[1] - b[1]);
    const [currentNode, currentDistance] = priorityQueue.shift()!;
    if (visited.has(currentNode)) continue;
    visited.add(currentNode);

    if (Object.is(currentNode, end)) {
      const path: T[] = [];
      let node: T | null = end;
      while (node !== null) {
        path.unshift(node);
        node = previous.get(node)!;
      }
      if(!includeFirst) {
        path.shift()
      }
      return { distance: currentDistance, path };
    }

    for (const neighbor of getNeighbors(currentNode)) {
      const weight = getWeight(currentNode, neighbor);
      const newDistance = currentDistance + weight;
      const existingDistance = distances.get(neighbor) ?? Infinity;
      if (newDistance < existingDistance) {
        distances.set(neighbor, newDistance);
        previous.set(neighbor, currentNode);
        priorityQueue.push([neighbor, newDistance]);
      }
    }
  }

  return null;
}