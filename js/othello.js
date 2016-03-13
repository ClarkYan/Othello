// JavaScript Document
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var mNone = 0; //empty
var mBlack = -1; //black chess
var mWhite = 1; //white chess
var mBlack_t = -2; //black hint
var mWhite_t = 2; //white hint
var playerWhite = mWhite; //white turn
var playerBlack = mBlack; //balck turn
var playerTurn = playerBlack;
var turn = -1;
var hint = false;
var follow = false;
var hintsOn = false;
var hintTurn = false;

var row = 0; //x-axis
var col = 0; //y-axis
            
var board = [];
//var counter = [];
          
initChess();
initBoard();
             
function initBoard() //initial chessboard 
{ 
    for (var i = 0; i <= 480; i += 60) 
    {         //绘制横线 
        ctx.beginPath();         
        ctx.moveTo(0, i);         
        ctx.lineTo(480, i)         
        ctx.closePath();         
        ctx.stroke();//绘制竖线 
        ctx.beginPath();         
        ctx.moveTo(i, 0);         
        ctx.lineTo(i, 480);         
        ctx.closePath();         
        ctx.stroke();     
    }
}

function initChess() //initial chess
{
    for (var x = 0; x < 8; x++) 
    {        
	    board[x] = []; 
        for (var y = 0; y < 8; y++) 
        {             
	        board[x][y] = mNone;         
	    } 
	}    
	board[3][3] = mWhite;
	board[3][4] = mBlack;
    board[4][3] = mBlack;
    board[4][4] = mWhite;
    displayBoard(board);
}

function windowTocanvas(canvas, row, col) 
{
    var bbox = canvas.getBoundingClientRect();
    row = row - bbox.left * (canvas.width / bbox.width); 
    col = col - bbox.top * (canvas.height / bbox.height);
    
    return {row, col};
}

function clickListener(e) 
{ 
	//displayBoard(board);
	//initBoard();
	var loc = windowTocanvas(canvas,e.clientX,e.clientY);
    //var x = parseInt((e.clientX) / 60);     
    //var y = parseInt((e.clientY) / 60);
    row = parseInt(loc.row / 60);
    col = parseInt(loc.col / 60);
    //alert(e.clientX);
    //alert(x);
    //alert(e.clientY);
    //alert(y);            
    if(isOnBoard(board, row, col))
    {
	   //alert("!!!");
	   hint = false;
	   var killCount = turnJudgement(board, row, col, playerTurn);
	   if(killCount > 0 && playerTurn < 0)
	   {
           drawChess(playerTurn, row, col);         
           //judge(1, x, y);
           displayBoard(board);
           initBoard(); 
           hintTurn = true;
           if(isFull(board))
           {
	           gameOver(board);
           }
           else
           {
	           if((!isBlackHint(board)) && (!isWhiteHint(board)))
	           {
		           gameOver(board);
	           }
	           else
	           {
		           if(!isWhiteHint(board))
		           {
			           //count chess
			           var counter = [];
			           countChess(counter);
			           document.getElementById('result').value = 'BLACK:' + counter[0] + ' ' + 'WHITE:' + counter[1] + ' ' + 'TURN:BLACK';
			           if(follow)
			           {
				           hints(board);
			           }
		           }
		           else
		           {
			           //alert(board);
                       playerTurn = playerTurn * (-1);
                       var counter = [];
			           countChess(counter);
			           document.getElementById('result').value = 'BLACK:' + counter[0] + ' ' + 'WHITE:' + counter[1] + ' ' + 'TURN:WHITE';
                       //count chess
                       if(follow)
                       {
	                       hints(board);
                       }
		           }
	           }
           }       
       }
       else if(killCount > 0 && playerTurn > 0)
       {
	       drawChess(playerTurn, row, col);         
           //judge(1, x, y);
           displayBoard(board);
           initBoard(); 
           hintTurn = false;
           if(isFull(board))
           {
	           gameOver(board);
           }
           else
           {
	           if((!isBlackHint(board)) && (!isWhiteHint(board)))
	           {
		           gameOver(board);
	           }
	           else
	           {
		           if(!isBlackHint(board))
		           {
			           //count chess
			           var counter = [];
			           countChess(counter);
			           document.getElementById('result').value = 'BLACK:' + counter[0] + ' ' + 'WHITE:' + counter[1] + ' ' + 'TURN:WHITE';
			           if(follow)
			           {
				           hints(board);
			           }
		           }
		           else
		           {
			           //alert(board);
                       playerTurn = playerTurn * (-1);
                       var counter = [];
			           countChess(counter);
			           document.getElementById('result').value = 'BLACK:' + counter[0] + ' ' + 'WHITE:' + counter[1] + ' ' + 'TURN:BLACK';
                       //count chess
                       if(follow)
                       {
	                       hints(board);
                       }
		           }
	           }
           }       
       }
    }
}

function countChess(counter) //0=black, 1=white, 2=empty
{
	var i, j;
	counter[0] = 0;
	counter[1] = 0;
	counter[2] = 0;
	for (i = 0; i < 8; i++)
        for (j = 0; j < 8; j++) {
            if (board[i][j] == playerBlack)
                (counter[0])++;
            else if (board[i][j] == playerWhite)
                (counter[1])++;
            else
                (counter[2])++;
        }
    return 0;
}

function hints(board)
{
	var i, j;
    hint = true;
    clearHints(board);
    for (i = 0; i < 8; i++)
        for (j = 0; j < 8; j++) { //judge the hints on eight directions
            if (!hintTurn) {
                if (board[i][j] == playerWhite) {
                    if (getRulesBlack(board, i, j + 1, -1) > 0) {
                        board[i][j + 1] = mBlack_t;
                    }
                    if (getRulesBlack(board, i + 1, j, -1) > 0) {
                        board[i + 1][j] = mBlack_t;
                    }
                    if (getRulesBlack(board, i - 1, j, -1) > 0) {
                        board[i - 1][j] = mBlack_t;
                    }
                    if (getRulesBlack(board, i, j - 1, -1) > 0) {
                        board[i][j - 1] = mBlack_t;
                    }
                    if (getRulesBlack(board, i + 1, j + 1, -1) > 0) {
                        board[i + 1][j + 1] = mBlack_t;
                    }
                    if (getRulesBlack(board, i + 1, j - 1, -1) > 0) {
                        board[i + 1][j - 1] = mBlack_t;
                    }
                    if (getRulesBlack(board, i - 1, j + 1, -1) > 0) {
                        board[i - 1][j + 1] = mBlack_t;
                    }
                    if (getRulesBlack(board, i - 1, j - 1, -1) > 0) {
                        board[i - 1][j - 1] = mBlack_t;
                    }
                }
            } else {
                if (board[i][j] == playerBlack) {
                    if (getRulesWhite(board, i, j + 1, 1) > 0) {
                        board[i][j + 1] = mWhite_t;
                    }
                    if (getRulesWhite(board, i + 1, j, 1) > 0) {
                        board[i + 1][j] = mWhite_t;
                    }
                    if (getRulesWhite(board, i - 1, j, 1) > 0) {
                        board[i - 1][j] = mWhite_t;
                    }
                    if (getRulesWhite(board, i, j - 1, 1) > 0) {
                        board[i][j - 1] = mWhite_t;
                    }
                    if (getRulesWhite(board, i + 1, j + 1, 1) > 0) {
                        board[i + 1][j + 1] = mWhite_t;
                    }
                    if (getRulesWhite(board, i + 1, j - 1, 1) > 0) {
                        board[i + 1][j - 1] = mWhite_t;
                    }
                    if (getRulesWhite(board, i - 1, j + 1, 1) > 0) {
                        board[i - 1][j + 1] = mWhite_t;
                    }
                    if (getRulesWhite(board, i - 1, j - 1, 1) > 0) {
                        board[i - 1][j - 1] = mWhite_t;
                    }
                }
            }
        }
    displayBoard(board); 
    initBoard();  
}

function isBlackHint(board) { //judge the hints on eight directions of black chess
    var i, j;
    hint = true;
    for (i = 0; i < 8; i++)
        for (j = 0; j < 8; j++) {
            if (board[i][j] == playerWhite) {
                if (getRulesBlack(board, i, j + 1, -1) > 0) {
                    return true;
                } else if (getRulesBlack(board, i + 1, j, -1) > 0) {
                    return true;
                } else if (getRulesBlack(board, i - 1, j, -1) > 0) {
                    return true;
                } else if (getRulesBlack(board, i, j - 1, -1) > 0) {
                    return true;
                } else if (getRulesBlack(board, i + 1, j + 1, -1) > 0) {
                    return true;
                } else if (getRulesBlack(board, i + 1, j - 1, -1) > 0) {
                    return true;
                } else if (getRulesBlack(board, i - 1, j + 1, -1) > 0) {
                    return true;
                } else if (getRulesBlack(board, i - 1, j - 1, -1) > 0) {
                    return true;
                }
            }
        }
    return false;
}
  
function isWhiteHint(board) { //judge the hints on eight directions of white chess
    var i, j;
    hint = true;
    for (i = 0; i < 8; i++)
        for (j = 0; j < 8; j++) {
            if (board[i][j] == playerBlack) {
                if (getRulesWhite(board, i, j + 1, 1) > 0) {
                    return true;
                } else if (getRulesWhite(board, i + 1, j, 1) > 0) {
                    return true;
                } else if (getRulesWhite(board, i - 1, j, 1) > 0) {
                    return true;
                } else if (getRulesWhite(board, i, j - 1, 1) > 0) {
                    return true;
                } else if (getRulesWhite(board, i + 1, j + 1, 1) > 0) {
                    return true;
                } else if (getRulesWhite(board, i + 1, j - 1, 1) > 0) {
                    return true;
                } else if (getRulesWhite(board, i - 1, j + 1, 1) > 0) {
                    return true;
                } else if (getRulesWhite(board, i - 1, j - 1, 1) > 0) {
                    return true;
                }
            }
        }
    return false;
}

function clearHints(board) { //clear the hints
    var i, j;
    for (i = 0; i < 8; i++)
        for (j = 0; j < 8; j++) {
            if (board[i][j] != playerBlack && board[i][j] != playerWhite && board[i][j] != mNone) {
                board[i][j] = mNone;
            }
        }
    displayBoard(board);
    initBoard();
}

function drawChess(chess, row, col)
{
	if (row >= 0 && row < 8 && col >= 0 && col < 8) 
    {
	    if(chess == mBlack)
	    {
	        ctx.fillStyle = "#000000"; //black chess
	        ctx.beginPath();
            ctx.arc(row * 60 + 30, col * 60 + 30, 25, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
            board[row][col] = mBlack; 
            //displayBoard(board);
            //initBoard();
	    }
	    else if(chess == mWhite)
	    {
		    ctx.fillStyle = "#FFFFFF"; //white chess
		    ctx.beginPath();
            ctx.arc(row * 60 + 30, col * 60 + 30, 25, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
            board[row][col] = mWhite; 
            //displayBoard(board);
            //initBoard();
	    }
	    else if(chess == mBlack_t)
	    {
		    ctx.fillStyle = "#000000"; //black transparent chess
		    ctx.beginPath();
            ctx.arc(row * 60 + 30, col * 60 + 30, 5, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
            //board[row][col] = mBlack_t; 
            //displayBoard(board);
            //initBoard();
	    }
	    else if(chess == mWhite_t)
	    {
		    ctx.fillStyle = "#FFFFFF"; //white transparent chess
		    ctx.beginPath();
            ctx.arc(row * 60 + 30, col * 60 + 30, 5, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
            //board[row][col] = mWhite_t; 
            //displayBoard(board);
            //initBoard();
	    }
	    else if(chess == mNone)
	    {
		    ctx.fillStyle = '#EEC591'; //empty
		    ctx.beginPath();
            ctx.rect(row * 60, col * 60, row * 60 + 60, row * 60 + 60);
            ctx.closePath();
            ctx.fill();
            board[row][col] = mNone;
            //displayBoard(board);
            //initBoard();
	    }
	    //displayBoard(board);
    }
}

function displayBoard(board)
{
	for (var x = 0; x < 8; x++) 
    {          
        for (var y = 0; y < 8; y++) 
        {             
	        if(board[x][y] == mBlack)
	        {
	           drawChess(mBlack, x, y);
	        }
	        else if(board[x][y] == mWhite)
	        {
	           drawChess(mWhite, x, y);
	        }
	        else if(board[x][y] == mBlack_t)
	        {
	           drawChess(mBlack_t, x, y);
	        }
	        else if(board[x][y] == mWhite_t)
	        {
	           drawChess(mWhite_t, x, y);
	        }
	        else
	        { 
	           drawChess(mNone, x, y);
	        }        
	    }     
	}
}

function isOnBoard(board, row, col)
{
	if(row >= 0 && col >= 0 && row < 8 && col < 8)
	{
		return true;
	}
	return false;
}

function isEmpty(board, row, col)
{
	if(board[row][col] != playerBlack && board[row][col] != playerWhite)
	{
		return true;
	}
	return false;
}

function isFull(board)
{
	var x, y;
	for (x = 0; x < 8; x++)
        for (y = 0; y < 8; y++) 
        {
            if ((board[x][y] != playerBlack) && (board[x][y] != playerWhite)) 
            {
                return false;
            }
        }
    return true;
}

function turnJudgement(board, row, col, turn)
{
	if (turn < 0) 
	{
        return getRulesBlack(board, row, col, turn);
    }
    else 
    {
        return getRulesWhite(board, row, col, turn);
    }
}

function getRulesBlack(board, row, col, turn) 
{ //check this click is a valid piece

        var dirX, dirY, killed = 0, count;
        var firstX, firstY, secondX, secondY, thirdX, thirdY;
        if (board == null) {
            return 0;
        }
        if (!isOnBoard(board, row, col)) {
            return 0;
        }
        if (!isEmpty(board, row, col)) {
	        //alert("There is not empty!");
            return 0;
        }

        for (dirX = -1; dirX < 2; dirX++)
            for (dirY = -1; dirY < 2; dirY++) { //judge the eight directions of each piece to find a neighbor
                if (dirX == 0 && dirY == 0)
                    continue;
                count = 0;
                firstX = row + dirY;
                firstY = col + dirX;
                if (firstX < 8 && firstY < 8 && firstX >= 0 && firstY >= 0 && board[firstX][firstY] == turn * (-1)) { //the neighbor is the different color

                    count++;

                    for (secondX = row + 2 * dirY, secondY = col + 2 * dirX; secondX >= 0 && secondY >= 0 && secondX < 8 && secondY < 8; secondX += dirY, secondY += dirX) {
                        if (board[secondX][secondY] == turn * (-1)) { //the next neighbor is the different color
                            count++;
                            continue;
                        } else if (board[secondX][secondY] == turn) { //the next neighbor is the same color
                            killed += count;

                            for (thirdX = row + dirY, thirdY = col + dirX; thirdX <= row + count && thirdX >= row - count && thirdY <= col + count && thirdY >= col - count; thirdX += dirY, thirdY += dirX) {
                                //do the recursive check
                                if (!hint) {
                                    board[thirdX][thirdY] = turn;
                                }

                            }
                            break;
                        } else break;
                    }
                }
            }

        if (killed > 0 && !hint){ //is a valid piece and set this piece

            board[row][col] = turn;

        }
        return killed;
}

    //the same as above algorithm for white chess
function getRulesWhite(board, row, col, turn) 
{
        var dirX, dirY, killed = 0, count = 0;
        var firstX, firstY, secondX, secondY, thirdX, thirdY;
        if (board == null) {
            return 0;
        }
        if (!isOnBoard(board, row, col)) {
            return 0;
        }
        if (!isEmpty(board, row, col)) {
            return 0;
        }

        for (dirX = -1; dirX < 2; dirX++)
            for (dirY = -1; dirY < 2; dirY++) {
                if (dirX == 0 && dirY == 0)
                    continue;
                count = 0;
                firstX = row + dirY;
                firstY = col + dirX;
                if (firstX < 8 && firstY < 8 && firstX >= 0 && firstY >= 0 && board[firstX][firstY] == turn * (-1)) {

                    count++;

                    for (secondX = row + 2 * dirY, secondY = col + 2 * dirX; secondX >= 0 && secondY >= 0 && secondX < 8 && secondY < 8; secondX += dirY, secondY += dirX) {
                        if (board[secondX][secondY] == turn * (-1)) {
                            count++;
                            continue;
                        } else if (board[secondX][secondY] == turn) {
                            killed += count;

                            for (thirdX = row + dirY, thirdY = col + dirX; thirdX <= row + count && thirdX >= row - count && thirdY <= col + count && thirdY >= col - count; thirdX += dirY, thirdY += dirX) {
                                if (!hint){
                                    board[thirdX][thirdY] = turn;
                                }

                            }
                            break;
                        } else break;
                    }
                }
            }

        if (killed > 0 && !hint){
            board[row][col] = turn;

        }
        return killed;
}

function newGame()
{
    initChess();
    initBoard();
    playerTurn = playerBlack;
    var counter = [];
    countChess(counter);
    document.getElementById('result').value = 'BLACK:' + counter[0] + ' ' + 'WHITE:' + counter[1] + ' ' + 'TURN:BLACK';
    hintTurn = false;
    if (follow == true) 
    {
        hints(board);
    } 
    else 
    {
        follow = false;
        hint = false;
        displayBoard(board);
        initBoard();
    }
}

function hintsEvent()
{
	if(!hintsOn)
	{
		//$("#hint").val("HINTS ON")
		document.getElementById('hint').value = 'HINTS ON';
		follow = true;
		hints(board);
		hintsOn = true;
	}
	else
	{
		document.getElementById('hint').value = 'HINTS OFF';
		follow = false;
	    clearHints(board);
	    hintsOn = false;
	}
}

function gameOver(board)
{
	var counter = [];
    countChess(counter);
    if(counter[0] > counter[1])
    {
	    document.getElementById('result').value = 'BLACK:' + counter[0] + ' ' + 'WHITE:' + counter[1] + ' ' + 'WIN:BLACK';
    }
    else if(counter[1] > counter[0])
    {
	    document.getElementById('result').value = 'BLACK:' + counter[0] + ' ' + 'WHITE:' + counter[1] + ' ' + 'WIN:WHITE';
    }
    else
    {
	    document.getElementById('result').value = 'BLACK:' + counter[0] + ' ' + 'WHITE:' + counter[1] + ' ' + 'DRAW GAME';
    }
	alert("GAME OVER!!");
}