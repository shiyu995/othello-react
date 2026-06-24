import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import * as logic from './gameLogic.js'


export default function Board() {
  // usestate
  console.log("aaaa")
  const [prompt, setprompt] = useState([{row:4, col:2}, {row:5, col:3}, {row:3, col:5},{row:2, col:4}])
  const [board, setboard] = useState(()=>logic.initBoard(prompt))
  const [xIsNext, setX] = useState(true)
  

  const squares=board.map((row, row_index)=>
    <>
      <div className="board-row">
        {
          row.map((col, col_index)=>
            <Square 
              key={`${row_index}-${col_index}`}
              value={board[row_index][col_index]}
              row={row_index} 
              col={col_index} 
              onSquareClick={()=>handleClick(row_index, col_index)}/>
          )
        }
      </div>
    </>
    );
  

  function handleClick(row_index, col_index){
    // use state
    if (board[row_index][col_index]!='*'){
      return
    }
    const newBoard = board.map(row => [...row]);
    const { cur, opp } = xIsNext ? {cur:'X', opp:'O'}:{cur:'O', opp:'X'}
    newBoard[row_index][col_index]=cur

    const directions=[
      [-1, 0],  // up
      [1, 0],   // down
      [0, -1],  // left
      [0, 1],   // right
      [-1, -1], // left up
      [-1, 1],  // right up
      [1, -1],  // left down
      [1, 1],   // right down
    ]

    logic.cleanBoard(newBoard)
    logic.flipBoard(newBoard, row_index, col_index, cur, opp, directions)
    const newPrompt=logic.getNextMoves(newBoard, cur, opp, directions)
    
    setX(!xIsNext)
    setboard(newBoard)
    setprompt(newPrompt)
  }


  return squares
}


function Square({value, row, col, onSquareClick}) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

// export default App
