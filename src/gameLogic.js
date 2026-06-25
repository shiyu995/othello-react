export const BOARD_LEN = 8
export const CENTER = BOARD_LEN / 2
export const DIRECTIONS=[
    [-1, 0],  // up
    [1, 0],   // down
    [0, -1],  // left
    [0, 1],   // right
    [-1, -1], // left up
    [-1, 1],  // right up
    [1, -1],  // left down
    [1, 1],   // right down
]

export function initBoard(){
    const board=Array(BOARD_LEN)
      .fill(null)
      .map(x=>Array(BOARD_LEN).fill(null))
    
    board[CENTER-1][CENTER-1]='X'
    board[CENTER][CENTER]='X'
    board[CENTER-1][CENTER]='O'
    board[CENTER][CENTER-1]='O'
    return board
  }

export function createInitGame(){
    const board=initBoard()
    const prompt = calculatePrompt(board, 'O', 'X')
    for (const {row, col} of prompt){
        board[row][col]='*'
    }
    return {
        board,
        prompt,
        turn:'X',
        gameover:false
    }
    
}

export function calculatePieces(board){
    let x_num=0
    let o_num=0
    for (let r=0;r<BOARD_LEN; r++){
        for (let c=0; c<BOARD_LEN;c++){
            if (board[r][c]=='X')
                x_num+=1
            else if(board[r][c]=='O')
                o_num+=1
        }
    }
    return {x_num, o_num}
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


export function calculatePrompt(newboard, lastPlayer, nextPlayer){
    const move=[]

    for (let r=0;r<BOARD_LEN;r++){
      for (let c=0;c<BOARD_LEN;c++){
        if (newboard[r][c]!==null)continue;

        for (const [dr, dc] of DIRECTIONS){
          let board_flip=[]
          for (let rp=r+dr, cp=c+dc; cp>=0 && cp<BOARD_LEN && rp>=0 && rp<BOARD_LEN; rp+=dr, cp+=dc){
            let res = saveFlipInfo(newboard, rp, cp, nextPlayer, lastPlayer, board_flip)
            if (res){
              if (board_flip.length>0){
                move.push({row:r, col:c})                
              }   
              break  //Avoid pushing the same position multiple times if it satisties multiple directions  
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

export function flipBoard(newBoard, row, col, cur, opp){
    for (const [dr, dc] of DIRECTIONS){
      let board_flip=[]
      for (let r=row+dr, c=col+dc; r>=0 && r<BOARD_LEN && c>=0 && c<BOARD_LEN; r+=dr, c+=dc){
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

export function getNextMoves(newBoard, lastPlayer, nextPlayer){
    const move=calculatePrompt(newBoard, lastPlayer, nextPlayer)

    for (const {row, col} of move){
      newBoard[row][col]='*'
    }
    return move
  }