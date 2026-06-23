import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'


export default function Board() {
  // usestate
  console.log("aaaa")
  const [prompt, setprompt] = useState([{row:4, col:2}, {row:5, col:3}, {row:3, col:5},{row:2, col:4}])
  const [board, setboard] = useState(()=>initBoard(prompt))
  const [xIsNext, setX] = useState(true)
  

  const squares=board.map((row, row_index)=>
    <>
      <div className="board-row">
        {
          row.map((col, col_index)=>
            <Square 
              value={board[row_index][col_index]}
              row={row_index} 
              col={col_index} 
              onSquareClick={()=>handleClick(row_index, col_index)}/>
          )
        }
      </div>
    </>
    );
  
  function initBoard(prompt){
    const board=Array(8)
      .fill(null)
      .map(x=>Array(8).fill(null))
    
    board[3][3]='X'
    board[4][4]='X'
    board[3][4]='O'
    board[4][3]='O'
    for (const {row, col} of prompt){
      board[row][col]='*'
    }
    return board
  }

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

    for (const [dr, dc] of directions){
      let board_flip=[]
      for (let r=row_index+dr, c=col_index+dc; r>=0 && r<8 && c>=0 && c<8; r+=dr, c+=dc){
        let res=save_flip_info(newBoard,r,c, cur, opp, board_flip)
        if (res){
          for (const {row, col} of board_flip){
            newBoard[row][col]=cur
          }
          break
        }
      }
    }
// 
    const newPrompt=getNextMoves(newBoard, cur, opp, directions, prompt)
    

    setX(!xIsNext)
    setboard(newBoard)
    setprompt(newPrompt)
  }

  function getNextMoves(newBoard, cur, opp, directions, prompt){
    for (const {row, col} of prompt){
      if (newBoard[row][col]=='*'){
        newBoard[row][col]=null
      }
    }
    const move=calculate_prompt(newBoard, cur, opp, directions)

    for (const {row, col} of move){
      newBoard[row][col]='*'
    }
    return move
  }

  function calculate_prompt(newboard, cur, opp, directions){
    const move=[]

    for (let r=0;r<8;r++){
      for (let c=0;c<8;c++){
        if (newboard[r][c]!==null)continue;

        for (const [dr, dc] of directions){
          let board_flip=[]
          for (let rp=r+dr, cp=c+dc; cp>=0 && cp<8 && rp>=0 && rp<8; rp+=dr, cp+=dc){
            let res=save_flip_info(newboard,rp,cp, opp, cur, board_flip)
            if (res){
              if (board_flip.length>0){
                move.push({row:r, col:c}) 
              }   
              break          
            }
          }
        }

      }
    }
    return move

  }

  function save_flip_info(newboard, row, col, cur, opp, board_flip){
    if (newboard[row][col]==cur){
      return true
    }
    else if (newboard[row][col]==opp){
      board_flip.push({row, col})
    }
    else {
      board_flip.length=0
      return true
    }
  
    return false
  }

  return squares
}


function Square({value, row, col, onSquareClick}) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

// export default App
