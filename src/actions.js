const clearBoard = [
    [null,null,null,null],
    [null,null,null,null],
    [null,null,null,null],
    [null,null,null,null]
];

const emptySpaces = board => {
        const arr = [];
        board.forEach((row, rowIndex) => {
            row.forEach((cell, celIndex) => {
                if (cell === null){
                    arr.push([rowIndex, celIndex])
                }
            })
        });
        return arr
    };

export const plusTwo = () => {
        const values = this.state.values;
        if (this.emptySpaces(values).length > 0){
            const coords = emptySpaces(values)[rand(emptySpaces(values).length)];
            values[coords[0]][coords[1]] = {value: 2, merged: false};
            this.setState({values})
        } else {
            gameOver()
        }
    };

 const rand = (num) => {
        return (Math.random() * num) | 0
    };

 export const sum = (r, a) => {
        return Array.isArray(a) ? a.reduce(sum, r) : r + a;
    };

 const gameOver = () => {
        alert('Game Over!');
        this.setState({ values: clearBoard })
    };

 const resetMerged = row => {
        row.forEach((_, index) => {
            if (row[index] !== null) {
                row[index].merged = false
            }
        })
    };

 const horizontalShift = row => {
        row.forEach((cell, cellIndex) => {
            if (cell === null) return;

            let currentIndex = cellIndex;

            while (true) {
                const currCell = row[currentIndex];
                const prevCell = row[currentIndex - 1];

                if (prevCell === null) {
                    row[currentIndex - 1] = currCell;
                    row[currentIndex] = null;
                    currentIndex -= 1;
                    continue
                }

                if (prevCell === undefined || prevCell.merged || prevCell.value !== currCell.value) break;

                row[currentIndex - 1] = {...prevCell, value: prevCell.value * 2, merged: true};
                row[currentIndex] = null;
                break
            }
        });
        return row;
    };

 const verticalShift = values => {

        values.forEach((row, rowIndex) => { // ri 1
            row.forEach((cell, colIndex) => { // ri 0
                if(cell === null) return;   // 2

                let currentRowIndex = rowIndex; // 1

                while(true) {
                    const currCell = values[currentRowIndex][colIndex]; // 1
                    const prevCell = currentRowIndex > 0 ? values[currentRowIndex - 1][colIndex] : undefined; // null

                    if(prevCell === null) {
                        values[currentRowIndex - 1][colIndex] = currCell;
                        values[currentRowIndex][colIndex] = null;
                        currentRowIndex -= 1;
                        continue
                    }

                    if(prevCell === undefined || prevCell.merged || prevCell.value !== currCell.value) break;

                    values[currentRowIndex - 1][colIndex] = {...prevCell, value: prevCell.value * 2, merged: true};
                    row[colIndex] = null;
                    break
                }
            });
            return row;
        });
    };

export const shiftUp = () => {
        const values = this.state.values;
        verticalShift(values)
        values.forEach(row => resetMerged(row))
    };

export const shiftDown = () => {
        const values = this.state.values;
        values.reverse();
        shiftUp();
        values.reverse();
    };

export const shiftLeft = () => {
        const values = [...this.state.values];
        values.forEach((row, rowIndex) => {
            horizontalShift(row);
            resetMerged(row)
        })
    };

export const shiftRight = () => {
        const values = [...this.state.values];
        values.forEach((row, rowIndex) => {
            row.reverse();
            horizontalShift(row);
            row.reverse();

            resetMerged(row)
        })
    };