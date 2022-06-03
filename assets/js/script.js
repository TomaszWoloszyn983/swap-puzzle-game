console.log("Run js script");

// NUmbers of rows and columns in the main board
var rows = 5;
var columns = 4;

var currTile;
var otherTile;

var turns = 0;
let pieces = [];

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
            tile.setAttribute("id", tileId);
            boardElement.appendChild(tile);
            console.log("Initialize tiles "+tile+" id = "+tile.innerHTML);
            
            tile.addEventListener("mouseover", highlight);
            tile.addEventListener("mouseleave", mouseLeave);

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


function shuffle(){
    /*
    Temporarly remove and replaced by setPieces function
    */ 
    // for (let i=1; i <= rows*columns; i++) {
    //     pieces.push(i.toString()); //put "1" to "20" into the array (puzzle images names)
    // }

    pieces.reverse();
    for (let i =0; i < pieces.length; i++) {
        let j = Math.floor(Math.random() * pieces.length);

        //swap
        let tmp = pieces[i];
        pieces[i] = pieces[j];
        pieces[j] = tmp;
    }
    console.log("Shuffle!");
}

// This function is propably going to be redundant and it will be replaced by random swapping tiles function
function fillBoard(){
    let board = document.getElementById("board");
    let tiles = board.children;
    console.log(board.children);
    console.log("Display some tile: "+document.querySelector("#board > img:nth-child(15)"
    )+"Another one: "+document.getElementById("tile5").src);

    for (let i = 0; i < pieces.length; i++) {
        let tile = document.createElement("img");
        tile.src = "assets/images/" + pieces[i] + ".jpg";
        console.log("Fill the board with"+tile);

        document.getElementById("board").append(tile);
    }
}

// Provisional version of the swap() function (Not working)
function swap() {
    let currImg = currTile.src;
    let otherImg = otherTile.src;
    currTile.src = otherImg;
    otherTile.src = currImg;
    console.log("I'm swapping tile no. ");
}

/*
This function highlights the hovered tile and its neighbours instead of 
the function in css.
*/ 
function highlight(){
    let thisTile = this.src;

    console.log("I'm highlighting tile no. "+thisTile); // shows undefined element
    this.style.border = "2px solid green";
    let neibs = neighbours(thisTile);
    // for(let neib of neibs){
    //     neib.src.style.border = "2px solid green";
    // }

    let tile20 = document.getElementById("tile16");
    tile20.style.border = "2px solid red";
    // Here I see that I can highlight a tile by id

}
function mouseLeave(event){
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
    console.log(result);

    for (let i=1; i<=columns*rows; i++){
        let tile2 = result[0]+"/assets/images/"+[i]+".jpg";
        console.log("compare thisTile "+thisTile+ " to "+tile2);
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
                console.log("Tile " +[i]+ " not found");
            }
        }   
        return neighbours;
}


function upperNeighbour(tileIndex){
    let upperTile = tileIndex + 4;
    if(upperTile > 0 && (upperTile <= columns*rows)){
        console.log(upperTile+" is a neighbour");
        return upperTile;
    }else{
        return 0;
    }
}
function lowerNeighbour(tileIndex){
    let lowerTile = tileIndex - 4;
    if(lowerTile > 0 && (lowerTile <= columns*rows)){
        console.log(lowerTile+" is a neighbour");
        return lowerTile;
    }else{
        return 0;
    }
}
function leftNeighbour(tileIndex){
    let leftTile = tileIndex - 1;
    if(leftTile > 0 && leftTile <= columns*rows 
        && leftTile != 4  && leftTile != 8  && leftTile != 12  && leftTile != 16){
            console.log(leftTile+" is a neighbour");
        return leftTile;
    }else{
        return 0;
    }
}
function rightNeighbour(tileIndex){
    let rightTile = tileIndex + 1;
    if(rightTile > 0 && rightTile <= columns*rows 
        && rightTile != 5  && rightTile != 9  && rightTile != 13  && rightTile != 17){
            console.log(rightTile+" is a neighbour");
        return rightTile;
    }else{
        return 0;
    }
}


