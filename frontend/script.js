// frontend/script.js
const gridElement = document.getElementById("grid");
const gridSize = { rows: 6, cols: 6 }; // Adjusted grid size to 6x6
const obstacles = [];
let startPoint = null;
let endPoint = null;

function createGrid() {
    gridElement.innerHTML = "";
    for (let i = 0; i < gridSize.rows; i++) {
        for (let j = 0; j < gridSize.cols; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.x = i;
            cell.dataset.y = j;
            cell.addEventListener("click", () => markCell(i, j, cell));
            gridElement.appendChild(cell);
        }
    }
}

function markCell(x, y, cell) {
    if (!startPoint) {
        startPoint = [x, y];
        cell.classList.add("start");
    } else if (!endPoint) {
        endPoint = [x, y];
        cell.classList.add("end");
    } else {
        obstacles.push([x, y]);
        cell.classList.add("obstacle");
    }
}

function calculatePath() {
    if (!startPoint || !endPoint) {
        alert("Please set both a start and end point.");
        return;
    }

    fetch('http://localhost:3000/calculate-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start: startPoint, end: endPoint, obstacles, gridSize })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.path) {
            highlightPath(data.path);
        } else {
            alert("No path found.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to calculate path. Check console for details.");
    });
}


function highlightPath(path) {
    path.forEach(([x, y]) => {
        const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        cell.classList.add("path");
    });
}

createGrid();
