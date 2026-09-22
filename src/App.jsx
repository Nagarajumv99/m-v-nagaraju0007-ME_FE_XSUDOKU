import { useState } from 'react'
import './App.css'

const EMPTY_BOARD = Array(81).fill('')

const isCompleteAndValid = (values) => {
  if (values.some((value) => value === '')) return false

  const hasUniqueValues = (group) => new Set(group).size === 9

  for (let index = 0; index < 9; index += 1) {
    const row = values.slice(index * 9, index * 9 + 9)
    const column = values.filter((_, cellIndex) => cellIndex % 9 === index)

    if (!hasUniqueValues(row) || !hasUniqueValues(column)) return false
  }

  for (let row = 0; row < 9; row += 3) {
    for (let column = 0; column < 9; column += 3) {
      const box = []

      for (let boxRow = row; boxRow < row + 3; boxRow += 1) {
        for (let boxColumn = column; boxColumn < column + 3; boxColumn += 1) {
          box.push(values[boxRow * 9 + boxColumn])
        }
      }

      if (!hasUniqueValues(box)) return false
    }
  }

  return true
}

function App() {
  const [board, setBoard] = useState(EMPTY_BOARD)
  const [result, setResult] = useState(null)

  const updateCell = (index, value) => {
    setBoard((currentBoard) => {
      const nextBoard = [...currentBoard]
      nextBoard[index] = value.replace(/[^1-9]/g, '').slice(-1)
      return nextBoard
    })
    setResult(null)
  }

  const validateBoard = () => {
    setResult(isCompleteAndValid(board))
  }

  const clearBoard = () => {
    setBoard(EMPTY_BOARD)
    setResult(null)
  }

  return (
    <main className="app-shell">
      <section className="validator-card" aria-labelledby="page-title">
        <div className="intro">
          <h1 id="page-title">Sudoku Validator</h1>
          <p className="description">Enter numbers 1-9 and validate the board.</p>
        </div>

        <div className="board" role="grid" aria-label="Sudoku board">
          {board.map((value, index) => (
            <input
              aria-label={`Row ${Math.floor(index / 9) + 1}, column ${(index % 9) + 1}`}
              className="cell"
              key={index}
              inputMode="numeric"
              maxLength="1"
              onChange={(event) => updateCell(index, event.target.value)}
              type="text"
              value={value}
            />
          ))}
        </div>

        <div className="actions">
          <button className="validate-button" onClick={validateBoard} type="button">
            Validate
          </button>
          <button className="clear-button" onClick={clearBoard} type="button">
            Clear
          </button>
        </div>

        {result !== null && (
          <p className={`result ${result ? 'valid' : 'invalid'}`} role="status">
            {result ? '☑️ Sudoku is valid so far!' : <><span aria-hidden="true">X</span> Invalid Sudoku! Conflicts found.</>}
          </p>
        )}
      </section>
    </main>
  )
}

export default App
