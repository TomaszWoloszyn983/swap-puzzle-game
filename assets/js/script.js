console.log("Run js script");

// Numbers of rows and columns in the main board
var rows = 5;
var columns = 4;

// Used for drag functionality
var currTile;
var otherTile;

var turns = 0;
var pieces = [];

window.onload = function(){
    console.log("Onload function.");
    let boardElement = document.getElementById("board");
    setPieces();
        /*Initialize the main board with tiles made of croped image*/ 
    let i = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            
            let tile = document.createElement("img");
            tile.src = "assets/images/"+(++i)+".jpg";
            let tileId = "tile"+i;
            tile.setAttribute("id", tileId);  // Add id attribute to the tile.
            boardElement.appendChild(tile);
            console.log("Initialize tiles "+tile+" id = "+tile.innerHTML);
            
            tile.addEventListener("mouseover", highlight);
            tile.addEventListener("mouseleave", mouseLeave);

            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart); //click on image to drag
            tile.addEventListener("dragover", dragOver);   //drag an image
            tile.addEventListener("dragenter", dragEnter); //dragging an image into another one
            tile.addEventListener("dragleave", dragLeave); //dragging an image away from another one
            tile.addEventListener("drop", dragDrop);       //drop an image onto another one
            tile.addEventListener("dragend", dragEnd);      //after you completed dragDrop

            document.getElementById("board").append(tile);
        }
    }
}

function setPieces(){
    for (let i=1; i <= rows*columns; i++) {
        pieces.push(i.toString()); //put "1" to "20" into the array (puzzle images names)
    }
    console.log("setPieces display array: "+pieces);
}

/*
    Shuffle takes an Array of pieces and return a new 
    array of pieces in random order.
*/ 
function shuffle(piecesList){
   
    let newList = piecesList;

    pieces.reverse();
    for (let i =0; i < newList.length; i++) {
        let j = Math.floor(Math.random() * newList.length);

        //swap
        let tmp = newList[i];
        newList[i] = newList[j];
        newList[j] = tmp;
    }
    console.log("Shuffle!");
    return newList;
}

function fillInOrder(){
    let board = document.getElementById("board");
    let tiles = board.children;

    for (let i = 0; i < pieces.length; i++) {
        console.log("Trying to replace: "+tiles[i].src+" with: "+"assets/images/" + pieces[i] + ".jpg");
        tiles[i].src = "assets/images/" + pieces[i] + ".jpg";
    }
}

/*
    FillBoard calls shuffle() function and fills up the board with 
    shuffled pieces.
*/ 
function fillBoard(){
    let board = document.getElementById("board");
    let tiles = board.children;
    let shuffledPieces = shuffle(pieces);

    for (let i = 0; i < shuffledPieces.length; i++) {
        console.log("Trying to replace: "+tiles[i].src+" with: "+"assets/images/" + shuffledPieces[i] + ".jpg");
        tiles[i].src = "assets/images/" + shuffledPieces[i] + ".jpg";
    }
}

function startNewGame(){
    fillBoard();
    turns = 0;
}

function stopThisGame(){
    fillInOrder();
    turns = 0;
}

/*
This function highlights the hovered tile and its neighbours instead of 
the function in css.
*/ 
function highlight(event){
    let tile = this.src;
    let hoveredTile = this.id;
    let neiList = neighboursList(hoveredTile);
    console.log('The id of the element you clicked: ' + hoveredTile);

    console.log("I'm highlighting piece no. "+tile);
    this.style.border = "2px solid green";
    for(let nei of neiList){
        let element = document.getElementById("tile"+nei).style.border = "2px dotted green";
    }   
}

function mouseLeave(event){
    let tiles = document.getElementById("board").children;
    for(let tile of tiles){
        tile.style.border = "2px solid blue";
    }
    this.style.border = "2px solid blue";
}

/*
    Searches for tiles neighbours which are elements below, above and on the sides of the tile.
    The function finds the neighbours by adding 1 for the right neighbour, subtracting 1 for the 
    left one, adding 4 for lower one and subtracting 4 for the upper one.
    It checking if the number of the tile isn't lower that 0 or higher than the number of all tiles
    in the board.

    Returns the array of the neighbours elements
*/ 
function neighbours(tile){
    let neighbours = [];
    let thisTile = tile;
    let url = tile.toString();
    let result = url.split('/assets');
    // console.log(result);

    for (let i=1; i<=columns*rows; i++){
        let tile2 = result[0]+"/assets/images/"+[i]+".jpg";
        // console.log("compare thisTile "+thisTile+ " to "+tile2);
            if(tile2 === thisTile){

                if(upperNeighbour(i)>0){
                    neighbours.push(result[0]+"/assets/images/"+upperNeighbour(i)+".jpg");
                }
                if(lowerNeighbour(i)>0){
                    neighbours.push(result[0]+"/assets/images/"+lowerNeighbour(i)+".jpg");
                }
                if(leftNeighbour(i)>0){
                    neighbours.push(result[0]+"/assets/images/"+leftNeighbour(i)+".jpg");
                }
                if(rightNeighbour(i)>0){
                    neighbours.push(result[0]+"/assets/images/"+rightNeighbour(i)+".jpg");
                }
                break;
            }else{
                // console.log("Tile " +[i]+ " not found");
            }
        }   
        return neighbours;
}

function neighboursList(tile){
    
    let index = parseInt(tile.substring(4));
    let list = [];

    (upperNeighbour(index) > 0) ?  list.push(upperNeighbour(index)) : 0;
    (leftNeighbour(index) > 0) ?  list.push(leftNeighbour(index)) : 0;
    (rightNeighbour(index) > 0) ?  list.push(rightNeighbour(index)) : 0;
    (lowerNeighbour(index) > 0) ?  list.push(lowerNeighbour(index)) : 0;
    
    console.log("Return neighnours list for: "+tile+" at index: "+index+" : "+list);
    return list;
}

function upperNeighbour(tileIndex){
    let upperTile = tileIndex + 4;
    if(upperTile > 0 && (upperTile <= columns*rows)){
        // console.log(upperTile+" is a neighbour");
        return upperTile;
    }else{
        return 0;
    }
}
function lowerNeighbour(tileIndex){
    let lowerTile = tileIndex - 4;
    if(lowerTile > 0 && (lowerTile <= columns*rows)){
        // console.log(lowerTile+" is a neighbour");
        return lowerTile;
    }else{
        return 0;
    }
}
function leftNeighbour(tileIndex){
    let leftTile = tileIndex - 1;
    if(leftTile > 0 && leftTile <= columns*rows 
        && leftTile != 4  && leftTile != 8  && leftTile != 12  && leftTile != 16){
            // console.log(leftTile+" is a neighbour");
        return leftTile;
    }else{
        return 0;
    }
}
function rightNeighbour(tileIndex){
    let rightTile = tileIndex + 1;
    if(rightTile > 0 && rightTile <= columns*rows 
        && rightTile != 5  && rightTile != 9  && rightTile != 13  && rightTile != 17){
            // console.log(rightTile+" is a neighbour");
        return rightTile;
    }else{
        return 0;
    }
}

//DRAG TILES
function dragStart() {
    currTile = this; //this refers to image that was clicked on for dragging
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    otherTile = this; //this refers to image that is being dropped on
}

function dragEnd() {
    if (currTile.src.includes("blank")) {
        return;
    }
    let currImg = currTile.src;
    let otherImg = otherTile.src;
    currTile.src = otherImg;
    otherTile.src = currImg;

    turns += 1;
    document.getElementById("turns").innerText = turns;

    isSolved();
}

/*
    Compare the current pieces order to the required order.
    If every piece is in the required order then the function 
    returns true.
*/ 
function isSolved(){
    let currentOrder =  document.getElementById("board").children;
    let url = currentOrder[0].src.toString();
    let result = url.split('/assets');

    for(let i=0; i<pieces.length; i++){
        let orderedPiece = result[0]+"/assets/images/" + pieces[i] + ".jpg";

        if(currentOrder[i].src == orderedPiece){
            // return true;
        }else{
            console.log("Element: "+currentOrder[i].src+" is NOT equal to element "+ orderedPiece);
            return false;
        }
    }
    console.log("The jigsaw has been solved!!!");
    return true;
}
