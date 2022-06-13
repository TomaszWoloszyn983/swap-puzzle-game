
// Numbers of rows and columns in the main board
const rows = 5;
const columns = 4;

// Used for drag functionality
let currTile;
let otherTile;

let gameOn = false;
let turns = 0;
let pieces = [];

// Class player stores two values: name and number of turns.
let player = {    
    name: "",
    turnsNumber: 0
}; 
let ranking = [];

window.onload = function(){

    getRankingFromLocalStorage();
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
            tile.setAttribute('alt', tileId); // Add alt attribute to the tile.
            boardElement.appendChild(tile);
            // console.log("Initialize tiles "+tile+" id = "+tile.id);
            
            //HOVERING OVER TILES
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
};

// buttons functionalities
let subminBtn = document.getElementById("submit_name");
subminBtn.addEventListener('click' , togglePopup2);

document.getElementById("about_btn").addEventListener('click', togglePopupAbout);
let closeAboutBtn = document.getElementById("closeAbout");
closeAboutBtn.addEventListener('click', togglePopupAbout);

document.getElementById("help_btn").addEventListener('click', togglePopupHelp);
let closeHelpBtn = document.getElementById("closeHelp");
closeHelpBtn.addEventListener('click', togglePopupHelp);
let inputName;

let startBtn = document.getElementById("btn_new_game");
startBtn.addEventListener('click' , toggleStartButton);




/**
 * Displays Popup up window when the puzzles are solved.
 * The window contains a text box that takes text value.
 * 
 * Also create a player object and adds it to the Best Results list
 * 
 * @returns Players name taken from the text box in the Popup window.
 */
function togglePopup2(){
    console.log("Toggle popup2 launched");
    let setName = document.getElementById("name_box").value;

    console.log("Name: "+setName+" captured from textbox");
    document.getElementById("popup-2").classList.toggle("active");

    if(setName === null || setName === ""){
        txt = "You were added to the Best Result ranking as an Anonymous";
        setName = "Anonymous";
    }else{
        txt = "Your result has been added to the best results list";
    }

    let player  = {name: setName, turnsNumber: turns};
        console.log(player.name+" "+txt);
        ranking.push(player);
        updateHtmlList(ranking);
        updateLocalStorage(ranking);

    console.log("Function popup2 adds player "+setName+" to the list.");
}

/**
 * Display Popup window that.
 */
function togglePopup(){
    console.log("Toggle popup launched");
    document.getElementById("popup-1").classList.toggle("active");
}

function togglePopupHelp(){
    console.log("Toggle popupHelp launched");
    document.getElementById("popup-help").classList.toggle("active");
}
function togglePopupAbout(){
    console.log("Toggle popupAbout launched");
    document.getElementById("popup-about").classList.toggle("active");
}

function setName(name){
    inputName = name;
    console.log("Input name  = "+ inputName);
}


function setPieces(){
    for (let i=1; i <= rows*columns; i++) {
        pieces.push(i.toString()); //put "1" to "20" into the array (puzzle images names)
    }
}

/*
    Shuffle takes an Array of pieces and return a new 
    array of pieces in random order.
*/ 
function shuffle(piecesList){
   
    let newList = piecesList;

    newList.reverse();
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

/**
 * Fills the game board with ordered pieces.
 */
function fillInOrder(){
    let board = document.getElementById("board");
    let tiles = board.children;

    console.log("Fill ordered after: "+pieces);
    for (let i = 0; i < pieces.length; i++) {    // Put pieces in the order. From 1 to 10.
        tiles[i].src = "assets/images/" + (i+1) + ".jpg";
    }
}

/*
    FillBoard calls shuffle() function to put pieces int random order and fills up the board 
    with shuffled pieces.
*/ 
function fillShuffle(){
    let board = document.getElementById("board");
    let tiles = board.children;
    console.log("Fill shuffle: "+pieces);
    let orderedPieces = pieces;
    let shuffledPieces = shuffle(orderedPieces);

    console.log("Fill shuffle after: "+pieces);

    for (let i = 0; i < shuffledPieces.length; i++) {
        // console.log("Trying to replace: "+tiles[i].src+" with: "+"assets/images/" + shuffledPieces[i] + ".jpg");
        tiles[i].src = "assets/images/" + shuffledPieces[i] + ".jpg";
    }
}

/**
 * Start new game and fiil up the board with randomly ordered pieces.
 * Reset the turn value to 0.
 */
function startNewGame(){
    fillShuffle();
    turns = 0;
    gameOn = true;
    document.getElementById("turns").innerText = turns;
}

/**
 * Reset the current game and restore the pieces to the order from 1 to 10.
 */
function quitGame(){
    fillInOrder();
    gameOn = false;
}

function toggleStartButton(button){

    // let button = document.getElementById("btn_new_game");
    // this.addEventListener('click', toggleStartButton());
    console.log("Toggling runs from: "+button.target.innerHTML+"...");
    button.target.innerHTML

    if(button.target.innerText == "Start New Game"){
        button.target.innerText = "Quit Game";
        console.log("...to quit");
        startNewGame();
    }else if(button.target.innerText == "Quit Game"){  
        button.target.innerText = "Start New Game";
        console.log("...to start");
        quitGame();
    }
}

/**
Highlights the hovered tile and its neighbours.
The hovered tile is highlighted with green solid line
whereas its neighbours sre highlighted with dotted line.
*/ 
function highlight(){
    let hoveredTile = this.id;
    let list = neighboursList(hoveredTile);

    let tiles = document.getElementById("board").children;
    for(let tile of tiles){
        tile.style.opacity = "0.8";
    }

    // Highlighting the hovered tile and its neighbours
    this.style.border = "2px solid green";
    this.style.opacity = "1";
            // this.classList.add('highlightTile'); //I was trying to add css class but it didn't work
            // for(let i=0; i>pieces.length; i++){
            //     document.getElementById("tile"+[i]).style.opacity = "0.7";
            // }
    
    for(let tile of list){
        document.getElementById("tile"+tile).style.border = "2px dotted green";
        document.getElementById("tile"+tile).style.opacity = "1";
            // let element = document.getElementById("tile"+nei).classList.add("neighbours"); 
            // ^^^  I was trying to add css class but it didn't work
    }   
}

/**
 * Restores the tiles style to the previous settings after hovering off.
 */
function mouseLeave(){
    let tiles = document.getElementById("board").children;
    for(let tile of tiles){
        tile.style.border = "2px solid blue";
        tile.style.opacity = "1";
    }
    this.style.border = "2px solid blue";
}

/**
 * Checks if tile2 is an element of the tile1 neighbours list
 * if it is the function returns true. If it's not returns false.
 * 
 * @param tile id 
 * @returns boolean
 */ 
function isNeighbour(tile1, tile2){

    let list = neighboursList(tile1);

    for(let l of list){
        // console.log("Compare: "+l+" to "+tile1);
        if("tile"+l == tile2){
            return true;
        }
    }
    return false;
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

/**
 * Takes: tile id
 * Finds neighbouring tiles Ids
 * Returns: list of integers that corespond with neighbouring tiles ids 
 */ 
function neighboursList(tile){
    
    let index = parseInt(tile.substring(4));
    let list = [];

    if(upperNeighbour(index) > 0){list.push(upperNeighbour(index));}   
    if(leftNeighbour(index) > 0){list.push(leftNeighbour(index));}
    if(rightNeighbour(index) > 0){list.push(rightNeighbour(index));}
    if(lowerNeighbour(index) > 0){list.push(lowerNeighbour(index));}
    
    return list;
}


        // FINDING NEIGHBOURS

/*
Finds id of the tile that is located in the row above the tile given as a parameter
If it finds it, the function returns the id of the tile. 
If it doesn't it returns 0 
 */
function upperNeighbour(tileIndex){
    let upperTile = tileIndex + 4;
    if(upperTile > 0 && (upperTile <= columns*rows)){
        return upperTile;
    }else{
        return 0;
    }
}

/*
Finds id of the tile that is located directly below the tile given as a parameter
If it finds it, the function returns the id of the tile. 
If it doesn't it returns 0 
 */
function lowerNeighbour(tileIndex){
    let lowerTile = tileIndex - 4;
    if(lowerTile > 0 && (lowerTile <= columns*rows)){
        return lowerTile;
    }else{
        return 0;
    }
}

/*
Finds id of the tile that is located directly on the left to the tile given as a parameter
If it finds it, the function returns the id of the tile. 
If it doesn't it returns 0 
 */
function leftNeighbour(tileIndex){
    let leftTile = tileIndex - 1;
    if(leftTile > 0 && leftTile <= columns*rows && leftTile != 4 && leftTile != 8 && leftTile != 12 && leftTile != 16){
        return leftTile;
    }else{
        return 0;
    }
}

/*
Finds id of the tile that is located directly on the right to the the tile given as a parameter
If it finds it, the function returns the id of the tile. 
If it doesn't it returns 0 
 */
function rightNeighbour(tileIndex){
    let rightTile = tileIndex + 1;
    if(rightTile > 0 && rightTile <= columns*rows && rightTile != 5  && rightTile != 9  && rightTile != 13  && rightTile != 17){
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

    let currImg = currTile.src;
    let otherImg = otherTile.src;

    // console.log("Display this image: "+currTile.id+" and the other one: "+otherTile.id);

    if(isNeighbour(currTile.id, otherTile.id)){
        currTile.src = otherImg;
        otherTile.src = currImg;
        turns += 1;
    }else{
        console.log("You only can drop drop this tile on its neighbouring tile: left, right, upper or lower");
        // otherTile.src.style.border = "2px solid red";
    }
  
    document.getElementById("turns").innerText = turns;

    isSolved();
}

/*
    Compare the current pieces order to the required order.
    If every piece is in the required order then the function 
    returns true.
    Function return false when meets the first not equal pair of elements

    Add condition below besides the turns > 0 condition.
     && gameOn == true

*/ 
function isSolved(){
    if(turns > 0){
        let currentOrder =  document.getElementById("board").children;
        let url = currentOrder[0].src.toString();
        let result = url.split('/assets');
        let txt;
        // console.log("New turn!")

        //  CHECK WINNIG CONDITIONS
        for(let i=0; i<pieces.length; i++){
            let orderedPiece = result[0]+"/assets/images/" + [i+1] + ".jpg";
            if(currentOrder[i].src == orderedPiece){
            }else{
                console.log("Element: "+currentOrder[i].src.substring(74)+" is equal NOT to element "+ orderedPiece.substring(74));
                return false;
            }
        }
        console.log("The jigsaw has been solved!!!");
        

        if(ranking.length < 10){                // if the result list isn't full

            console.log("Ranking < 10");
            document.getElementById("popupContent").innerHTML = "Well Done!!!"+
            "\nYou've solved the puzzles in "+turns+" turns!"+
            "\nThat is our new record."+
            "\nWould you like to write your name to our best results list?";  

            togglePopup2();
            console.log("togglepopup is closing. Setname is: "+setName);        

        }else if(turns < ranking[9].turnsNumber && ranking.length>=10){ // if player qualify to the best results
            console.log("Ranking 10");
            togglePopup2();
            ranking.pop();
            
                
        }else{                                  // if player doesn't qualify to the best results
            console.log("Ranking poza zasięgiem");                               
            if (confirm("Well Done!!!"+
            "\nYou've solved the puzzles in "+turns+" turns!"+
            "\nWould You like to play again?")) {
                txt = "You pressed OK!";
                startNewGame();
            } else {
                txt = "You pressed Cancel!";
            }
            togglePopup();   
            document.getElementById("popupContent").innerHTML = "You've solved the puzzles in "+turns+" turns!"+
            "\nWould You like to play again?";
        }

        console.log("Ranking after: "+ranking.length+" :"+ranking[0].name+". Ranking last member "+ranking[ranking.length-1].name);   
        return true;

    }else if(turns>5 && gameOn == false){
        window.alert('Press "Start New Game" button to start the game');
    }else{
        return false;
    }
}

/**
    If players turnsnumber is lower than the last members of the 
    ranking list, then add the new player to the ranking list.
    Sort the the list ascendingly to the turnsNumber.
    If the aaray length is getting bigger than 10 delete the last member.
 * @param {*} player 
 */ 
function addToRanking(player){

        if(player.turnsNumber < ranking[ranking.length-1].turnsNumber){
            ranking.push(player);
            ranking.sort(function(a, b) {
                    return a.turnsNumber - b.turnsNumber;
                });

            if(ranking.length>10){
                ranking.pop();
            }
        }

        updateHtmlList(ranking);
        updateLocalStorage(ranking);
    
}

/**
 * Function is sorting the ranking and then it adds
 * elements from ranking to the HTML ordered list.
 * */ 
function updateHtmlList(ranking){
    ranking.sort(function (a, b) {
            return a.turnsNumber - b.turnsNumber;
        });
    let array = ranking;
    let list = "<ol>";
    for (let i = 0; i < array.length; i++){
        list += '<li>' + array[i].name+" : "+array[i].turnsNumber+" turns" + '</li>';
    }
    list += "</ol>";
    document.getElementById("ranking").innerHTML = list;
}

/**
 * Function uploads ranking of the best results to the Local Storage.
 * 
 * @param ranking 
 */
function updateLocalStorage(ranking){
    console.log("Update local storage");
    localStorage.setItem('swapPuzzle', JSON.stringify(ranking));
}

/**
 * Dowwnload the list of the best results from the Local Storage.
 */
function getRankingFromLocalStorage(){
    let items = JSON.parse(localStorage.getItem('swapPuzzle')) || [];

    console.log("Data downloaded from local storage: "+ranking);
    for(player of items){
        console.log("Data downloaded from local storage: name: "+player.name+" turns: "+player.turnsNumber);
    }
    ranking = items;
    updateHtmlList(items);
}



//                  Bugs

// turns < 0 shuold be one of the winning conditions.
