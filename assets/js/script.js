
// Numbers of rows and columns in the main board
var rows = 5;
var columns = 4;

// Used for drag functionality
var currTile;
var otherTile;

var gameOn = false;
var turns = 0;
var pieces = [];

let player = {
    name: "",
    turnsNumber: 0
}; // Stores two values: name and number of turns.
var ranking = [];

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
}

// 
let subminBtn = document.getElementById("submit_name");
subminBtn.addEventListener('click' , togglePopup2);

document.getElementById("about_btn").addEventListener('click', togglePopupAbout);
let closeAboutBtn = document.getElementById("closeAbout");
closeAboutBtn.addEventListener('click', togglePopupAbout);

document.getElementById("help_btn").addEventListener('click', togglePopupHelp);
let closeHelpBtn = document.getElementById("closeHelp");
closeHelpBtn.addEventListener('click', togglePopupHelp);
let inputName;




function togglePopup2(){
    console.log("Toggle popup2 launched");
    let name = document.getElementById("name_box").value;
    setName(inputName);
    console.log("Name: "+name+" captured from textbox");
    document.getElementById("popup-2").classList.toggle("active");
    return name;
}

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
        // console.log("Trying to replace: "+tiles[i].src+" with: "+"assets/images/" + pieces[i] + ".jpg");
        tiles[i].src = "assets/images/" + pieces[i] + ".jpg";
    }
}

/*
    FillBoard calls shuffle() function and fills up the board with 
    shuffled pieces.
*/ 
function fillShuffle(){
    let board = document.getElementById("board");
    let tiles = board.children;
    let shuffledPieces = shuffle(pieces);

    for (let i = 0; i < shuffledPieces.length; i++) {
        // console.log("Trying to replace: "+tiles[i].src+" with: "+"assets/images/" + shuffledPieces[i] + ".jpg");
        tiles[i].src = "assets/images/" + shuffledPieces[i] + ".jpg";
    }
}

function startNewGame(){
    fillShuffle();
    turns = 0;
    gameOn = true;
    document.getElementById("turns").innerText = turns;
}

function quitGame(){
    fillInOrder();
    gameOn = false;
}

function toggleStartButton(button){

    // let button = document.getElementById("btn_new_game");
    // this.addEventListener('click', toggleStartButton());
    console.log("Toggling runs from: "+button.innerHTML+"...");

    if(button.getAttribute(onclick) == startNewGame()){
        button.innerHTML = "Quit Game";
        console.log("...to quit");
        this.onclick = quitGame();
    }else if(button.getAttribute(onclick) == quitGame()){   //  
        button.innerHTML = "Start New Game";
        console.log("...to start");
        this.onclick = startNewGame();
    }
}

/**
Highlights the hovered tile and its neighbours.
The hovered tile is highlighted with green solid line
whereas its neighbours sre highlighted with dotted line.
*/ 
function highlight(event){
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
 * 
 */
function mouseLeave(event){
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

    (upperNeighbour(index) > 0) ?  list.push(upperNeighbour(index)) : 0;
    (leftNeighbour(index) > 0) ?  list.push(leftNeighbour(index)) : 0;
    (rightNeighbour(index) > 0) ?  list.push(rightNeighbour(index)) : 0;
    (lowerNeighbour(index) > 0) ?  list.push(lowerNeighbour(index)) : 0;
    
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
    if(leftTile > 0 && leftTile <= columns*rows 
        && leftTile != 4  && leftTile != 8  && leftTile != 12  && leftTile != 16){
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
    if(rightTile > 0 && rightTile <= columns*rows 
        && rightTile != 5  && rightTile != 9  && rightTile != 13  && rightTile != 17){
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
        let setname;
        // console.log("New turn!")

        //  CHECK WINNIG CONDITIONS
        for(let i=0; i<pieces.length; i++){
            let orderedPiece = result[0]+"/assets/images/" + [i+1] + ".jpg";
            // console.log("Compare: "+currentOrder[i].src.substring(74)+" to : "+ orderedPiece.substring(74));
            if(currentOrder[i].src == orderedPiece){
                // console.log("Element: "+currentOrder[i].src.substring(74)+" is equal to element "+ orderedPiece.substring(74));
            }else{
                console.log("Element: "+currentOrder[i].src.substring(74)+" is equal NOT to element "+ orderedPiece.substring(74));
                return false;
            }
        }
        console.log("The jigsaw has been solved!!!");
        // window.confirm("Well Done\n You've solved the puzzles in "+turns+" turns");

        console.log("Ranking: "+ranking.length);   
        
  
   
        if(ranking.length < 10){ 
            
            console.log("Ranking < 10");
            document.getElementById("popupContent").innerHTML = "Well Done!!!"+
            "\nYou've solved the puzzles in "+turns+" turns!"+
            "\nThat is our new record."+
            "\nWould you like to write your name to our best results list?";                // if the result list isn't full
            setname = togglePopup2();
            console.log("togglepopup is closing. Setname is: "+setname);        
            // setname = prompt("Well Done!!!"+
            // "\nYou've solved the puzzles in "+turns+" turns!"+
            // "\nthat is our new record."+
            // "\nWould you like to write your name to our best results list?");
            
            if(setname == null || setname == ""){
                txt = "You were added to the Best Result ranking as a Anonymous";
                setname = "Anonymous";
                let player  = {name: setname, turnsNumber: turns};
                ranking.push(player);
                updateHtmlList(ranking);
                updateLocalStorage(ranking);
            }else{
                txt = "Your result has been added to the best results list";
                let player  = {name: setname, turnsNumber: turns};
                console.log(player.name+" "+txt);
                ranking.push(player);
                updateHtmlList(ranking);
                updateLocalStorage(ranking);
            }

        }else if(turns < ranking[9].turnsNumber){ // if player qualify to the best results
            console.log("Ranking 10");
            setname = prompt("Well Done!!!"+
            "\nYou've solved the puzzles in "+turns+" turns!"+
            "\nThis qualify to the Best Results ranking."+
            "\nWould you like to write your name?");
            if(setname == null || setname == ""){
                txt = "You were added to the Best Result ranking as a Anonymous";
                setname = "Anonymous";
                let player  = {name: setname, turnsNumber: turns};
                addToRanking(player);
            }else{
                txt = "Your result has been added to the best results list";
                let player  = {name: setname, turnsNumber: turns};
                addToRanking(player);
            }
            
                
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
    let turnsNumber = player.turnsNumber;

        if(player.turnsNumber < ranking[ranking.length-1].turnsNumber){
            ranking.push(player);
            console.log("player "+player.name+" added to ranking");
            ranking.sort((a, b) => {
                return a.turnsNumber - b.turnsNumber;
                })
            
            if(ranking.length>10){
                ranking.pop();
            }
        }
        console.log("ranking contains now :"+ranking);
        updateHtmlList(ranking);

        console.log("Adding ranking to te local starage");
        updateHtmlList(ranking);
        updateLocalStorage(ranking);
    
}
/**
 * Synchronizig list doesn't work!
 * which means that the result are not displayed in the right order
 * */ 
function updateHtmlList(ranking){
    console.log("Updating ranking");
    ranking.sort((a, b) => {
        return a.turnsNumber - b.turnsNumber;
        })
    let array = ranking;
    let list = "<ol>";
    for (i = 0; i < array.length; i++){
        list += '<li>' + array[i].name+" : "+array[i].turnsNumber+" turns" + '</li>';
    }
    list += "</ol>";
    document.getElementById("ranking").innerHTML = list;
}

function updateLocalStorage(ranking){
    console.log("Update local storage");
    localStorage.setItem('swapPuzzle', JSON.stringify(ranking));
}

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
