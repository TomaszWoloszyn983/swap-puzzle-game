
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

            // INITIALIZE TILES WITH PIECES OF IMAGE
            let tile = document.createElement("img");
            tile.src = "assets/images/"+(++i)+".jpg";
            let tileId = "tile"+i;
            tile.setAttribute("id", tileId);  // Add id attribute to the tile.
            tile.setAttribute('alt', tileId); // Add alt attribute to the tile.
            boardElement.appendChild(tile);
            
            //HOVERING OVER AND HIGHLIGHTING TILES
            tile.addEventListener("mousedown", highlight);
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

// buttons Event Listeners.
let submitNoRecord = document.getElementById("submit_no_record");
submitNoRecord.addEventListener('click', popUpWin3);

let submitName = document.getElementById("submit_name");        // Here is the bug. Click submit name twice
submitName.addEventListener('click', popUpWin1);            

document.getElementById("about_btn").addEventListener('click', togglePopupAbout);
let closeAboutBtn = document.getElementById("closeAbout");
closeAboutBtn.addEventListener('click', togglePopupAbout);

document.getElementById("help_btn").addEventListener('click', togglePopupHelp);
let closeHelpBtn = document.getElementById("closeHelp");
closeHelpBtn.addEventListener('click', togglePopupHelp);

let startBtn = document.getElementById("btn_new_game");
startBtn.addEventListener('click' , toggleStartButton);

/**
 * Display Popup window when the turns result doesn't qualify to the Bast Results list.
 */
function togglePopup(){
    document.getElementById("popup-1").classList.toggle("active");
}

/**
 * Activates and deactivates Popup window.
 */
function togglePopup2(){
    document.getElementById("popup-2").classList.toggle("active");
}

/**
 * Takes a value from input text box and use it ot initialize players name.
 * Then adds the player to the best results list.
 */
function popUpWin1(){
    let setName = document.getElementById("name_box").value;

    if(setName === null || setName === ""){
        setName = "Anonymous";
    }

    let player  = {name: setName, turnsNumber: turns};
        ranking.push(player);
        updateHtmlList(ranking);
        updateLocalStorage(ranking);

    document.getElementById("popup-2").classList.toggle("active");
}

/**
 * Activate and deactivate Popup window when the game is won but the result doesn't 
 * qualify to the Best Resluts.
 */
function popUpWin3(){
    document.getElementById("popup-1").classList.toggle("active");
}

/**
 * Activate and deactivate Help popup window.
 */
function togglePopupHelp(){
    document.getElementById("popup-help").classList.toggle("active");
}

/**
 * Activate and deactivate About popup window.
 */
function togglePopupAbout(){
    document.getElementById("popup-about").classList.toggle("active");
}

/**
 * Used in onLoad function to initialize the pieces array.
 */
function setPieces(){
    for (let i=1; i <= rows*columns; i++) {
        pieces.push(i.toString()); //put "1" to "20" into the array (puzzle images names)
    }
}

/*
    Take an Array of pieces and return a new 
    array of pieces ordered randomly.
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
    return newList;
}

/**
 * Fills the game board with ordered pieces.
 */
function fillInOrder(){
    let board = document.getElementById("board");
    let tiles = board.children;

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
    let orderedPieces = pieces;
    let shuffledPieces = shuffle(orderedPieces);

    for (let i = 0; i < shuffledPieces.length; i++) {
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
    turns = 0;
    document.getElementById("turns").innerText = turns;
    gameOn = false;
}

/**
 * Toggling betwen Start New Game button and Quit Game button.
 * @param {*} button 
 */
function toggleStartButton(button){

    if(button.target.innerText == "Start New Game"){
        button.target.innerText = "Quit Game";
        startNewGame();
    }else if((button.target.innerText == "Quit Game") || (button.target.innerText == "Game Complete")){  
        button.target.innerText = "Start New Game";
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
    
    if(gameOn == true){
        let tiles = document.getElementById("board").children;
        for(let tile of tiles){
            tile.style.opacity = "0.7";
        }

        // Highlighting the hovered tile and its neighbours
        this.style.border = "2px solid yellow";
        this.style.opacity = "1";

        for(let tile of list){
            document.getElementById("tile"+tile).style.border = "2px dotted yellow";
            document.getElementById("tile"+tile).style.opacity = "1";
        }   
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
        if("tile"+l == tile2){
            return true;
        }
    }
    return false;
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


                    //   SWAP TILES SECTION
/**
 * Drag and Drop swapping process.
 */
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

/**
 * Concludes the Drag And Drop swap process.
 * Swap tiles.
 * Check if condition to win the game is met.
 */
function dragEnd() {

    let currImg = currTile.src;
    let otherImg = otherTile.src;
    
    if(gameOn === true){
        if(isNeighbour(currTile.id, otherTile.id)){
            currTile.src = otherImg;
            otherTile.src = currImg;
            turns += 1;
        }else{
            document.getElementById('message_box').innerText = "You can only swap a tile with their nearest neighbouring tiles";
            setTimeout(() => {
                document.getElementById('message_box').innerText = "";
            }, 3000);
        }                                                    
    }
  
    document.getElementById("turns").innerText = turns;
    isSolved();
}

/**
 *  Compare the current pieces order to the required order.
    If every piece is in the required order then the function 
    returns true.
    Function return false when meets the first not equal pair of elements

    Add condition below besides the turns > 0 condition.
    && gameOn == true
 * 
 * @returns 
 */
function isSolved(){
    if(turns > 0 && gameOn === true){
        let currentOrder =  document.getElementById("board").children;
        let url = currentOrder[0].src.toString();
        let result = url.split('/assets');

        //  Check if the condition to win the game is met. If it isn't the function returns false and the rest of the code isn't executed.
        for(let i=0; i<pieces.length; i++){
            let orderedPiece = result[0]+"/assets/images/" + [i+1] + ".jpg";
            if(currentOrder[i].src == orderedPiece){
            }else{
                return false;
            }
        }

        /**
         * If the condition is met and the game is won the code below is executed.
         * 
         * Depending on what condition is met Popup modal box will be initialized with a different String value
         * and corresponding functions will be called.
         */
        if(ranking.length != 0 && turns < ranking[0].turnsNumber){  // If the result is better than the first result in the ranking.
            document.getElementById("popupContentTwo").innerText = "You've solved the puzzles in "+turns+" turns!"+
            "\nThis is our new record. Write your name";
            togglePopup2(); 
        }else if(ranking.length < 10){                          // if the result list isn't full/it's length is smaller than 10.
            document.getElementById("popupContentTwo").innerHTML = 
            "You've solved the puzzles in "+turns+" turns!"+
            "\nThis qualify to our Best Results."+
            "\nWould you like to write your name to our best results list?"; 
            togglePopup2();       

        }else if(turns < ranking[9].turnsNumber && ranking.length>=10){ // if player qualify to the best results
            document.getElementById("popupContentTwo").innerHTML = 
            "\nYou've solved the puzzles in "+turns+" turns!"+
            "\You result qualify to our Best Results."+
            "\nWould you like to write your name to our best results list?"; 
            togglePopup2();
            ranking.pop();  
            console.log("One out of the ranking :"+ ranking.length);
        }else{                                                  // if player doesn't qualify to the best results  
            document.getElementById("popupContentOne").innerText = "You've solved the puzzles in "+turns+" turns!"+
            "\nStart a new game to try again.";                           
            togglePopup();   
            
        }  
        document.getElementById('btn_new_game').innerText = "Game Complete";
        gameOn = false;
        return true;

    }else if(gameOn == false){
        document.getElementById('message_box').innerText = "Click Start New Game button.";
            setTimeout(() => {
                document.getElementById('message_box').innerText = "";
            }, 3000);
    }else{
        return false;
    }
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
    localStorage.setItem('swapPuzzle', JSON.stringify(ranking));
}

/**
 * Download the list of the best results from the Local Storage.
 */
function getRankingFromLocalStorage(){
    let items = JSON.parse(localStorage.getItem('swapPuzzle')) || [];

    ranking = items;
    updateHtmlList(items);
}

