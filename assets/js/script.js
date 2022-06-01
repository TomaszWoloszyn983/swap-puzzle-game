console.log("Run js script");

// NUmbers of rows and columns in the main board
var rows = 5;
var columns = 4;

var currTile;
var otherTile;

var turns = 0;
let pieces = [];

window.onload = function(){
    console.log("Onload function");

        /*Initialize the main board with tiles made of croped image*/ 
    let i = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            
            let tile = document.createElement("img");
            tile.src = "assets/images/"+(++i)+".jpg";
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

function fillBoard(){
    let board = document.getElementById("board");
    shuffle();

    for (let i = 0; i < pieces.length; i++) {
        let tile = document.createElement("img");
        tile.src = "assets/images/" + pieces[i] + ".jpg";
        console.log("Fill the board");

        document.getElementById("board").append(tile);
    }
}

