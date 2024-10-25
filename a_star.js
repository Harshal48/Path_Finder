// backend/a_star.js
class Node {
    constructor(x, y, g = 0, h = 0, parent = null) {
        this.x = x;
        this.y = y;
        this.g = g;
        this.h = h;
        this.parent = parent;
    }

    get f() {
        return this.g + this.h;
    }
}

function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function aStar(start, end, obstacles, gridSize) {
    const openSet = [];
    const closedSet = new Set();
    const obstacleSet = new Set(obstacles.map(([x, y]) => `${x},${y}`));

    openSet.push(new Node(start[0], start[1]));

    while (openSet.length > 0) {
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift();

        if (current.x === end[0] && current.y === end[1]) {
            const path = [];
            let temp = current;
            while (temp) {
                path.push([temp.x, temp.y]);
                temp = temp.parent;
            }
            return path.reverse();
        }

        closedSet.add(`${current.x},${current.y}`);

        const neighbors = [
            [0, -1], [0, 1], [-1, 0], [1, 0]
        ];

        for (let [dx, dy] of neighbors) {
            const x = current.x + dx;
            const y = current.y + dy;

            if (x < 0 || x >= gridSize.rows || y < 0 || y >= gridSize.cols) continue;
            if (closedSet.has(`${x},${y}`) || obstacleSet.has(`${x},${y}`)) continue;

            const g = current.g + 1;
            const h = heuristic(new Node(x, y), new Node(end[0], end[1]));
            const neighbor = new Node(x, y, g, h, current);

            const openNode = openSet.find(n => n.x === x && n.y === y);
            if (!openNode || g < openNode.g) {
                openSet.push(neighbor);
            }
        }
    }

    return []; // Return empty path if no solution
}

module.exports = aStar;
