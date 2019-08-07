import React from "react";
import Square from "./Square"

export default class Board extends React.Component{

    clearBoard = [
        [null,null,null,null],
        [null,null,null,null],
        [null,null,null,null],
        [null,null,null,null]
    ];

    state = {
        values: this.clearBoard
    };

    handleKeyDown = key => {
        switch (key) {
            case 'ArrowDown':
                this.shiftDown();
                this.plusTwo();
                break;
            case 'ArrowUp':
                this.shiftUp();
                this.plusTwo();
                break;
            case 'ArrowLeft':
                this.shiftLeft();
                this.plusTwo();
                break;
            case 'ArrowRight':
                this.shiftRight();
                this.plusTwo();
                break;
            default:
                break;
        }
    };

    emptySpaces = board => {
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

    plusTwo = () => {
        const values = this.state.values;
        if (this.emptySpaces(values).length > 0){
            const coords = this.emptySpaces(values)[this.rand(this.emptySpaces(values).length)];
            values[coords[0]][coords[1]] = {value: 2, merged: false};
            this.setState({values})
        } else {
            this.gameOver()
        }
    };

    rand(num){
        return (Math.random() * num) | 0
    };

    sum = (r, a) => {
        return Array.isArray(a) ? a.reduce(this.sum, r) : r + a;
    };

    gameOver = () => {
        alert('Game Over!');
        this.setState({ values: this.clearBoard })
    };

    resetMerged = row => {
        row.forEach((_, index) => {
            if (row[index] !== null) {
                row[index].merged = false
            }
        })
    };

    horizontalShift = row => {
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

    verticalShift = values => {

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

    shiftUp = () => {
        const values = this.state.values;
        this.verticalShift(values)
        values.forEach(row => this.resetMerged(row))
    };

    shiftDown = () => {
        const values = this.state.values;
        values.reverse();
        this.shiftUp();
        values.reverse();
    };

    shiftLeft = () => {
        const values = [...this.state.values];
        values.forEach((row, rowIndex) => {
            this.horizontalShift(row);
            this.resetMerged(row)
        })
    };

    shiftRight = () => {
        const values = [...this.state.values];
        values.forEach((row, rowIndex) => {
            row.reverse();
            this.horizontalShift(row);
            row.reverse();

            this.resetMerged(row)
        })
    };

    componentDidMount() {
        document.addEventListener('keydown', e => this.handleKeyDown(e.key));
        if (!this.state.values.reduce(this.sum, 0) > 0){
            this.plusTwo()
        }
    }

    render() {
        const vals = this.state.values;
        return (
            <>
                <h1 id="title">twentyfortyeight</h1>
                <div className="game-board">
                    {
                        vals.map((row, rowIndex) => {
                            return (
                                <div key={rowIndex} className={'board-row'}>
                                    {
                                        row.map((cell, cellIndex) => {
                                            return <Square key={`${rowIndex}-${cellIndex}`} value={cell ? cell.value : null} />
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </>
        )
    }
}