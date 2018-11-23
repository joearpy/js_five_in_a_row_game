const gridSize = 9;

let cursorCol = 0,
    cursorRow = 0,
    stepCount = 0,
    finished = false;

const tableGrid = document.getElementById("grid");
const spanStepCount = document.getElementById("stepCount");
const spanCurrentMark = document.getElementById("currentMark");

window.addEventListener("keydown", onKeyDown);
window.addEventListener("gameFinished", onGameFinished);

renderGrid();
setCursor(0, 0);
updateCurrentMarkSpan();

function renderGrid() {

    tableGrid.innerHTML = "";

    //rows
    for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) {

        let newRow = document.createElement("tr");

        //cells
        for (let colIndex = 0; colIndex < gridSize; colIndex++) {

            let newCell = document.createElement("td");

            newRow.appendChild(newCell);
            
        }

        tableGrid.appendChild(newRow);
    }
}

function setCursor (rowIndex, colIndex) {
    if (rowIndex >= gridSize) {
        return;
    }

    if (colIndex >= gridSize) {
        return;
    }

    let rowCollection = tableGrid.children,
        cellCollection = rowCollection[rowIndex].children;
        cell = cellCollection[colIndex];

    let oldCursors = document.getElementsByClassName("cursor");
    for (let cursorIndex = 0; cursorIndex < oldCursors.length; cursorIndex++) {
        oldCursors[cursorIndex].className = "";        
    }
    cell.className = "cursor";
}

function onKeyDown(event) {
    switch (event.code) {
        case "ArrowUp":
        case "ArrowRight":
        case "ArrowDown":
        case "ArrowLeft":
            let direction = event.code;
            direction = direction.replace("Arrow", "");
            moveCursor(direction);
            break;
        case "Space":
            placeMark();
            break;
    }
}

function onGameFinished () {
    const message = "Game Over, the winner: " + getCurrentMark();
    alert (message);
}

function moveCursor(direction) {
    switch (direction) {
        case "Up":
            cursorRow = Math.max(0, cursorRow - 1);
            break;
        case "Right":
            cursorCol = Math.min(gridSize - 1, cursorCol + 1);
            break;
        case "Down":
            cursorRow = Math.min(gridSize - 1, cursorRow + 1);
            break;
        case "Left":
            cursorCol = Math.max(0, cursorCol - 1);
            break;
    }
    console.log(cursorRow);
    setCursor(cursorRow, cursorCol);
}

function placeMark() {
    if (finished) {
        return;
    }

    setCellValue(cursorRow, cursorCol, getCurrentMark());
    if (isGameFinished()) {
        finished = true;
        triggerGameFinished();
    }
    incrementStepCount();
}

function setCellValue (rowIndex, collIndex, value) {
    let rowCollection = tableGrid.children,
        cellCollection = rowCollection[rowIndex].children;
        cell = cellCollection[collIndex];

    cell.innerText = value;

}
function getCellValue (rowIndex, collIndex, value) {
    let rowCollection = tableGrid.children,
        cellCollection = rowCollection[rowIndex].children;
        cell = cellCollection[collIndex];

    return cell.innerText;
}

function incrementStepCount () {
    stepCount++;
    spanStepCount.innerText = stepCount;
    updateCurrentMarkSpan();
}

function getCurrentMark () {
    return stepCount % 2 == 0 ? "X" : "O";
}

function updateCurrentMarkSpan () {
    spanCurrentMark.innerText = getCurrentMark();
}

function isGameFinished () {
    //vertical
    for (let rowIndex = 2; rowIndex < gridSize-2; rowIndex++) {
        for (let colIndex = 0; colIndex < gridSize; colIndex++) {
            let cellValues = [
                getCellValue(rowIndex - 2, colIndex),
                getCellValue(rowIndex - 1, colIndex),
                getCellValue(rowIndex, colIndex),
                getCellValue(rowIndex + 1, colIndex),
                getCellValue(rowIndex + 2, colIndex)
            ];
            

            if (countValue(cellValues, "X") == 5) {
                return true;
            }

            if (countValue(cellValues, "O") == 5) {
                return true;
            }

        }
    }

    //horizontal
    for (let colIndex = 2; colIndex < gridSize - 2; colIndex++) {
        for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) {

            let cellValues = [
                getCellValue(rowIndex, colIndex - 2),
                getCellValue(rowIndex, colIndex - 1),
                getCellValue(rowIndex, colIndex),
                getCellValue(rowIndex, colIndex + 1),
                getCellValue(rowIndex, colIndex + 2)
            ];

            if (countValue(cellValues, 'O') == 5) {
                return true;
            }

            if (countValue(cellValues, 'X') == 5) {
                return true;
            }
        }
    }

    //diagonal
    for (let rowIndex = 2; rowIndex < gridSize-2; rowIndex++) {
        for (let colIndex = 2; colIndex < gridSize-2; colIndex++) {

            let cellValues = [
                getCellValue(rowIndex - 2, colIndex - 2),
                getCellValue(rowIndex - 1, colIndex - 1),
                getCellValue(rowIndex, colIndex),
                getCellValue(rowIndex + 1, colIndex + 1),
                getCellValue(rowIndex + 2, colIndex + 2)
            ];
            
            if (countValue(cellValues, "X") == 5) {
                return true;
            }

            if (countValue(cellValues, "O") == 5) {
                return true;
            }

        }
    }

    return false;
}

function countValue (valueCollection, valueToCount) {
    return valueCollection.filter(function(item){
        return item == valueToCount;
    }).length;
}

function triggerGameFinished () {
    let event = new Event("gameFinished");
    window.dispatchEvent(event);
}