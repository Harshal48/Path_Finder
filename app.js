// backend/app.js
const express = require('express');
const cors = require('cors');
const aStar = require('./a_star');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/calculate-path', (req, res) => {
    const { start, end, obstacles, gridSize } = req.body;
    
    if (!start || !end || !gridSize) {
        return res.status(400).json({ error: "Invalid input." });
    }

    const path = aStar(start, end, obstacles, gridSize);
    
    res.json({ path });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
