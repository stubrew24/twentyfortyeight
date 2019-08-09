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
        values: this.clearBoard,
        score: 0,
        moved: false
    };

    handleKeyDown = key => {
        switch (key) {
            case 'ArrowDown':
                this.shiftDown();
                this.checkGameOver()
                this.setState({moved: false})
                break;
            case 'ArrowUp':
                this.shiftUp();
                this.checkGameOver()
                this.setState({moved: false})
                break;
            case 'ArrowLeft':
                this.shiftLeft();
                this.checkGameOver()
                this.setState({moved: false})
                break;
            case 'ArrowRight':
                this.shiftRight();
                this.checkGameOver()
                this.setState({moved: false})
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
        }
    };

    checkGameOver = () => {
        let moves = false
        const board = this.state.values
        if (this.emptySpaces(board).length > 0) moves = true
        board.forEach((row,rowIndex) => {

            row.forEach((col, colIndex) => {
                let cur = row[colIndex]
                let next = row[colIndex + 1]

                if (cur === next) moves = true
                if (board[rowIndex-1] !== undefined && cur === board[rowIndex-1][colIndex]) moves = true
                if (cur !== null && next !== null && next !== undefined && board[rowIndex-1] !== undefined && board[rowIndex-1][colIndex] !== null){
                    console.log(cur)
                    console.log(next)
                    if (cur.value === next.value) moves = true
                    if (cur.value === board[rowIndex-1][colIndex].value) moves = true
                }
            })
        })
        if (!moves) this.gameOver()
    };
    rand(num){
        return (Math.random() * num) | 0
    };

    sum = (r, a) => {
        return Array.isArray(a) ? a.reduce(this.sum, r) : r + a;
    };

    gameOver = () => {
        alert('Game Over!');
        console.log(this.state)
        this.setState({ values: this.clearBoard, score: 0 })
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
                    this.setState({moved: true})
                    continue
                }

                if (prevCell === undefined || prevCell.merged || prevCell.value !== currCell.value) break;

                row[currentIndex - 1] = {...prevCell, value: prevCell.value * 2, merged: true};
                this.setState({score: this.state.score + (prevCell.value * 2)})
                this.setState({moved: true})
                row[currentIndex] = null;
                break
            }
        });
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
                        this.setState({moved: true})
                        continue
                    }

                    if(prevCell === undefined || prevCell.merged || prevCell.value !== currCell.value) break;

                    values[currentRowIndex - 1][colIndex] = {...prevCell, value: prevCell.value * 2, merged: true};
                    this.setState({score: this.state.score + (prevCell.value * 2)})
                    row[colIndex] = null;
                    this.setState({moved: true})
                    break
                }
            });
            // return row;
        });
    };

    shiftUp = () => {
        const values = this.state.values;
        this.verticalShift(values)
        values.forEach(row => this.resetMerged(row))
        this.setState({values})
        if (this.state.moved) this.plusTwo()
    };

    shiftDown = () => {
        const values = this.state.values;
        values.reverse();
        this.verticalShift(values)
        values.forEach(row => this.resetMerged(row))
        values.reverse();
        this.setState({values})
        if (this.state.moved) this.plusTwo()
    };

    shiftLeft = () => {
        const values = [...this.state.values];
        values.forEach((row, rowIndex) => {
            this.horizontalShift(row);
            this.resetMerged(row)
        })
        if (this.state.moved) this.plusTwo()
        this.setState({values})
    };

    shiftRight = () => {
        const values = [...this.state.values];
        values.forEach((row, rowIndex) => {
            row.reverse();
            this.horizontalShift(row);
            row.reverse();

            this.resetMerged(row)
        })
        if (this.state.moved) this.plusTwo()
        this.setState({values})
    };

    componentDidMount() {
        document.addEventListener('keydown', e => this.handleKeyDown(e.key));
        if (!this.state.values.reduce(this.sum, 0) > 0){
            this.plusTwo()
            this.plusTwo()
        }
    }

    render() {
        return (
            <>
                <h1 id="title">twentyfortyeight (BETA)</h1>
                <h2 style={{textAlign:'center'}}>Score: {this.state.score}</h2>
                <div className="game-board">
                    {
                        this.state.values.map((row, rowIndex) => {
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