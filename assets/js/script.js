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

        /*Initialize the main board with tiles made of croped image*/ 
    let i = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            
            let tile = document.createElement("img");
            tile.src = "assets/images/"+(++i)+".jpg";
            // console.log("Displaying tile "+tile.src); // Displaying tiles

            // fillBoard();
            tile.addEventListener("mouseover", highlight);
            tile.addEventListener("mouseleave", mouseLeave);

            document.getElementById("board").append(tile);
        }
    }
}


// for (let i=1; i <= rows*columns; i++) {
//     pieces.push(i.toString()); //put "1" to "20" into the array (puzzle images names)
// }

function shuffle(){
    for (let i=1; i <= rows*columns; i++) {
        pieces.push(i.toString()); //put "1" to "20" into the array (puzzle images names)
    }

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
    console.log("Display some tile: "+document.querySelector("#board > img:nth-child(15)"));

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
function highlight(event){
    let thisTile = this.src;
    console.log("I'm highlighting tile no. "+thisTile); // shows undefined element
    this.style.border = "2px solid green";
    isNeighbour(thisTile);
}
function mouseLeave(event){
    this.style.border = "2px solid blue";
}

function isNeighbour(tile){
    let thisTile = tile
    console.log("isNeighbour launched for tile: "+thisTile);
    for (let piece in pieces){
        console.log("Run for loop "+piece);
        if(piece.src === thisTile){
            console.log(piece.src+" compare to "+string);
        }else{
            console.log("Tile not found");
        }
    }
}


