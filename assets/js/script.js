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

            /* Consider creating a Tile object that contains image and id, initialize it here and add to 
               Tiles array.
               Another idea would be to create a code that creates a div with class tile
               in HTML
            */

            // fillBoard();

            /*
            Next: add EventListener for clicked tile.
            it has to highlight the clicked element and the elements that are its neighbours.
            The cliked element has to be styled in css.
            Also function swap has to be defined
            */ 
            tile.addEventListener("click", highlight); //click on image to drag
            // tile.addEventListener("click", swap); //click on image to drag

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

function highlight(event){
    console.log("I'm highlighting tile no. "+this.currImg); // shows undefined element
    this.style.border = "3px solid green";
}

