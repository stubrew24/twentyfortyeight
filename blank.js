const square = document.getElementById('square')
const scoreDiv = document.getElementById('score')

let score = 0

const showScore = () => {
	scoreDiv.innerText = score
}

showScore()

const shiftLeft = board => {
	board.forEach((row, rowIndex) => {
		row.forEach((cell, cellIndex) => {
            if (cell === null) return
			let currentIndex = cellIndex
            while (row[currentIndex - 1] === null  || row[currentIndex - 1] === row[currentIndex]) {
				if (row[currentIndex - 1] === row[currentIndex]) {
					row[currentIndex - 1] = row[currentIndex] + row[currentIndex - 1]
					score += (row[currentIndex] * 2)
					showScore()
					row[currentIndex] = null
					currentIndex -= 1
				} else {
					row[currentIndex - 1] = row[currentIndex]
					row[currentIndex] = null
					currentIndex -= 1
				}
			}
		})
    })
    return board
}

const shiftUp = board => {
	board.forEach((row, rowIndex) => {
		row.forEach((cell, cellIndex) => {
            if (cell === null) return
            let currentRowIndex = rowIndex

            while (board[currentRowIndex - 1] !== undefined && (board[currentRowIndex - 1][cellIndex] === null || board[currentRowIndex - 1][cellIndex] === board[currentRowIndex][cellIndex])) {
				if (board[currentRowIndex - 1][cellIndex] === null){
					board[currentRowIndex - 1][cellIndex] = board[currentRowIndex][cellIndex]
					board[currentRowIndex][cellIndex] = null
					currentRowIndex -= 1
				} else if (board[currentRowIndex - 1][cellIndex] === board[currentRowIndex][cellIndex]){
					board[currentRowIndex - 1][cellIndex] = board[currentRowIndex - 1][cellIndex] + board[currentRowIndex][cellIndex]
					score += (board[currentRowIndex][cellIndex] * 2)
					showScore()
					board[currentRowIndex][cellIndex] = null
					currentRowIndex -= 1
				}
			}
		})
    })
    
    return board
}

const shiftDown = board => {
	board.reverse()
	shiftUp(board)
	board.reverse()
	return board
}

const shiftRight = board => {
	board.forEach((row, rowIndex) => {
		row.reverse()
		row.forEach((cell, cellIndex) => {
            if (cell === null) return
            
            let currentIndex = cellIndex
            
            while (row[currentIndex - 1] === null  || row[currentIndex - 1] === row[currentIndex]) {
				if (row[currentIndex - 1] === null){
					row[currentIndex - 1] = row[currentIndex]
					row[currentIndex] = null
					currentIndex -= 1
				} else if (row[currentIndex - 1] === row[currentIndex]){
					row[currentIndex - 1] = row[currentIndex] + row[currentIndex - 1]
					row[currentIndex] = null
					currentIndex -= 1
				}
			}
		})
		row.reverse()
    })
    
    return board
}

const board = [
        [null,null,null,null],
        [null,null,null,null],
        [null,null,null,null],
		[null,null,null,null]]

const emptySpaces = board => {
	const arr = []
	board.forEach((row, rowIndex) => {
		row.forEach((cell, celIndex) => {
			if (cell === null){
				arr.push([rowIndex, celIndex])
			}
		})
	})
	return arr
}

const plusTwo = board => {
	if (emptySpaces(board
		).length > 0){
		const coords = emptySpaces(board)[rand(emptySpaces(board).length)]
		board[coords[0]][coords[1]] = 2
	} else {
		gameOver()
	}
}

const rand = num => {
    return (Math.random() * num) | 0
  }

const showBoard = board => {
	document.getElementById('sq-01').innerText = board[0][0]
	document.getElementById('sq-02').innerText = board[0][1]
	document.getElementById('sq-03').innerText = board[0][2]
	document.getElementById('sq-04').innerText = board[0][3]
	document.getElementById('sq-05').innerText = board[1][0]
	document.getElementById('sq-06').innerText = board[1][1]
	document.getElementById('sq-07').innerText = board[1][2]
	document.getElementById('sq-08').innerText = board[1][3]
	document.getElementById('sq-09').innerText = board[2][0]
	document.getElementById('sq-10').innerText = board[2][1]
	document.getElementById('sq-11').innerText = board[2][2]
	document.getElementById('sq-12').innerText = board[2][3]
	document.getElementById('sq-13').innerText = board[3][0]
	document.getElementById('sq-14').innerText = board[3][1]
	document.getElementById('sq-15').innerText = board[3][2]
	document.getElementById('sq-16').innerText = board[3][3]
}
      
document.addEventListener('keydown', e => {
  	switch(e.key){
        case 'ArrowDown':
			shiftDown(board)
			plusTwo(board)
			break;
        case 'ArrowUp':
			shiftUp(board)
			plusTwo(board)
			break;
        case 'ArrowLeft':
			shiftLeft(board)
			plusTwo(board)
			break;
        case 'ArrowRight':
			shiftRight(board)
			plusTwo(board)
            break;
        default:
            break;
    } 
    showBoard(board)
})

const gameOver = () => {
	alert('Game Over!')
}

const init = () => {
	plusTwo(board)
	plusTwo(board)
	showBoard(board)
}

init()