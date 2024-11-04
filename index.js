function drawTetrisPlayground(x, y, target) {
    if (x <= 0 || y <= 0) throw new Error('x and y must be greater than zero');

    for (let rowsCount = 0; rowsCount < y; rowsCount++) {
        const row = document.createElement('div');
        row.className = 'row';
        row.dataset['row'] = rowsCount;

        for (let cellsCount = 0; cellsCount < x; cellsCount++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset['cell'] = cellsCount;
            row.append(cell);
        }
        target.append(row);
    }
}

const tetrisPlaygroundTarget = document.querySelector('.tetris-playground');
const rowsCount = 20;
const columnsCount = 10;

if (tetrisPlaygroundTarget) {
    try {
        drawTetrisPlayground(columnsCount, rowsCount, tetrisPlaygroundTarget);
    } catch (e) {
        console.log(e.message);
    }
} else {
    console.log("Tetris playground element not found");
}

const shapes = {
    S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'yellowgreen' },
    Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'red' },
    T: { shape: [[1, 1, 1], [0, 1, 0]], color: 'purple' },
    O: { shape: [[1, 1], [1, 1]], color: 'yellow' },
    J: { shape: [[0, 1], [0, 1], [1, 1]], color: 'blue' },
    L: { shape: [[1, 0], [1, 0], [1, 1]], color: 'orange' },
    I: { shape: [[1], [1], [1], [1]], color: 'lightblue' }
};

let currentShape;
let shapePosition = { x: 0, y: 0 };

function renderShape() {
    console.log("Rendering shape at position:", shapePosition);
    console.log("Current shape:", currentShape);

    const rowsToColor = currentShape.shape.length;
    const cellsToColor = currentShape.shape[0].length;

    for (let rowIndex = 0; rowIndex < rowsToColor; rowIndex++) {
        const targetRow = shapePosition.y + rowIndex;
        if (targetRow >= rowsCount) continue;

        const row = tetrisPlaygroundTarget.children[targetRow];
        for (let cellIndex = 0; cellIndex < cellsToColor; cellIndex++) {
            const targetCell = shapePosition.x + cellIndex;
            if (targetCell >= columnsCount) continue;

            const cell = row.children[targetCell];
            cell.style.backgroundColor = currentShape.shape[rowIndex][cellIndex] ? currentShape.color : '';
            console.log(`Cell at row ${targetRow}, col ${targetCell} set to color ${cell.style.backgroundColor}`);
        }
    }
}

function removePreviousShape() {
    for (let row of tetrisPlaygroundTarget.children) {
        for (let cell of row.children) {
            cell.style.backgroundColor = '';
        }
    }
}

function rotateShape(shape) {
    console.log("Rotating shape:", shape);
    if (shape.length === 2 && shape[0].length === 2) return shape;

    const rotatedShape = [];
    for (let rowsCount = 0; rowsCount < shape[0].length; rowsCount++) {
        rotatedShape.push([]);
    }

    for (let i = shape.length - 1, k = 0; i >= 0; i--, k++) {
        for (let j = 0; j < shape[0].length; j++) {
            rotatedShape[j][k] = shape[i][j];
        }
    }

    console.log("Rotated shape:", rotatedShape);
    return rotatedShape;
}

function spawnNewShape() {
    const shapeKeys = Object.keys(shapes);
    const shapeKeyIndex = Math.floor(Math.random() * shapeKeys.length);
    currentShape = shapes[shapeKeys[shapeKeyIndex]];
    shapePosition = { x: 0, y: 0 }; // Set initial shape position to top
    console.log("New shape spawned:", currentShape);
    renderShape();
}

spawnNewShape();

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        console.log("Space key pressed for rotation");
        currentShape.shape = rotateShape(currentShape.shape);
        removePreviousShape();
        renderShape();
    }
});
