export function initBoard(prompt){
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

export function saveFlipInfo(newboard, row, col, cur, opp, board_flip){
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


export function calculatePrompt(newboard, cur, opp, directions){
    const move=[]

    for (let r=0;r<8;r++){
      for (let c=0;c<8;c++){
        if (newboard[r][c]!==null)continue;

        for (const [dr, dc] of directions){
          let board_flip=[]
          for (let rp=r+dr, cp=c+dc; cp>=0 && cp<8 && rp>=0 && rp<8; rp+=dr, cp+=dc){
            let res = saveFlipInfo(newboard, rp, cp, opp, cur, board_flip)
            if (res){
              if (board_flip.length>0){
                move.push({row:r, col:c}) 
                break //Avoid pushing the same position multiple times if it satisties multiple directions 
              }   
              break          
            }
          }
        }
      }
    }
    return move

  }

export function cleanBoard(board){
    for (let r=0;r<board.length; r++){
        for (let c=0;c<board[0].length; c++){
            if (board[r][c]=='*')
                board[r][c]=null
        }
    }
}

export function flipBoard(newBoard, row, col, cur, opp, directions){
    for (const [dr, dc] of directions){
      let board_flip=[]
      for (let r=row+dr, c=col+dc; r>=0 && r<8 && c>=0 && c<8; r+=dr, c+=dc){
        let res = saveFlipInfo(newBoard,r,c, cur, opp, board_flip)
        if (res){
          for (const {row, col} of board_flip){
            newBoard[row][col]=cur
          }
          break
        }
      }
    }
}

export function getNextMoves(newBoard, cur, opp, directions){
    const move=calculatePrompt(newBoard, cur, opp, directions)

    for (const {row, col} of move){
      newBoard[row][col]='*'
    }
    return move
  }