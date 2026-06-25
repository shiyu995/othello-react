import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import * as logic from './gameLogic.js'


export default function Board() {
 
  const [game, setgame]=useState(()=>logic.createInitGame())
  const squares=game.board.map((row, row_index)=>
      <div className="board-row" key={row_index}>
        {
          row.map((col, col_index)=>
            <Square 
              key={`${row_index}-${col_index}`}
              value={game.board[row_index][col_index]}
              onSquareClick={()=>handleClick(row_index, col_index)}/>
          )
        }
      </div>
    );
  
  function handleClick(row_index, col_index){
  
    if (game.board[row_index][col_index]!='*' || game.gameover){
      return
    }
    const newBoard = game.board.map(row => [...row]);
    const { cur, next } = game.turn=='X' ? {cur:'X', next:'O'}:{cur:'O', next:'X'}
    newBoard[row_index][col_index]=cur

    let ends=game.gameover

    logic.cleanBoard(newBoard)
    logic.flipBoard(newBoard, row_index, col_index, cur, next)

    let newPrompt=logic.getNextMoves(newBoard, cur, next)

    let nextPlayer=next
    if (newPrompt.length==0){
      nextPlayer=cur
      newPrompt = logic.getNextMoves(newBoard, next, cur)
      if (newPrompt.length==0){
        console.log("Game ends")
        ends=true
      }
    }
    
    setgame({
      board: newBoard,
      prompt: newPrompt,
      turn: nextPlayer,
      gameover:ends
    })
  }

  let gameInfo=null
  const {x_num, o_num} = logic.calculatePieces(game.board)
  if (game.gameover){
    let winner;
    if (x_num > o_num) winner = 'X';
    else if (o_num > x_num) winner = 'O';
    else winner = 'Draw';
    gameInfo = `Game Over! ${winner} wins! | X:${x_num} O:${o_num}`
  }   
  else{
    gameInfo = `Turn: ${game.turn} | X:${x_num} O:${o_num}`
  }
    
  function handleReset(){
    setgame(logic.createInitGame())
  }
  return <>
  <div>{gameInfo}</div>
  {squares}
  <button onClick={handleReset}>restart</button>
  </>
}


function Square({value, onSquareClick}) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

