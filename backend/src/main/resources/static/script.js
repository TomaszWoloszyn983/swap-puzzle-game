// Numbers of rows and columns in the main board
const rows = 5;
const columns = 4;

// Directories where image pieces are stored
const piecesDir = "assets/images/pieces";
const defaultDir = "assets/images/default";
let useDir = piecesDir;

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
let ranking = []; // {name : score}

function initializeBoard() {
    console.log("Start game on " + useDir)

    // getRankingFromLocalStorage();
    getRankingFromBackend()

    let boardElement = document.getElementById("board");
    boardElement.innerHTML = ""; // clear board if needed

    pieces = []; // reset pieces array
    console.log("delay set pieces ...")
    setPieces();

    loadBalance(); // load token balance
    loadWallet();
    updateClaimSubmitState(); 
    let i = 0;
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

            let tile = document.createElement("img");
            // tile.src = useDir + "/piece_" + (i++) + ".jpg";
            tile.src = useDir + "/piece_" + (i++) + ".jpg?v=" + Date.now(); // add cache buster

            let tileId = "tile" + i;
            tile.setAttribute("id", tileId);
            tile.setAttribute("alt", tileId);

            tile.addEventListener("mousedown", highlight);
            tile.addEventListener("mouseleave", mouseLeave);
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            boardElement.appendChild(tile);
        }
    }
}

/**
 * Displays Upload New Image popup window.
 * Handles: opening popup, uploading image, loading indicator, canceling upload
 */
document.addEventListener("DOMContentLoaded", () => {
    const uploadBtn = document.getElementById("btn_upload_image");
    let closeUploadBtn = document.getElementById("closeUpload");
    document.getElementById("uploadForm").addEventListener("submit", async function(e) {
        e.preventDefault();

        const submitBtn = document.getElementById("uploadSubmit");
        const loadingText = document.getElementById("uploadLoading");

        submitBtn.disabled = true;
        loadingText.style.display = "inline";

        const formData = new FormData();
        formData.append("image", document.getElementById("imageInput").files[0]);

        const res = await fetch("/upload", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        submitBtn.disabled = false;
        loadingText.style.display = "none";

        if (data.pieces) {
            toggleUploadPopup();

            // 🔥 WAIT before loading board
            location.reload();
        }
        initializeBoard();
    });

    uploadBtn.addEventListener("click", toggleUploadPopup);
    closeUploadBtn.addEventListener("click", toggleUploadPopup);
    }
);


function toggleUploadPopup() {
    document.getElementById("popup-upload").classList.toggle("active");
}


/**
 * Sends request to loaclhost to check if there are any files
 * uploaded by the user.
 * 
 * If so, it set the users pieces folder
 * Otherwise it sets the folder with default pieces.
 */
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("api/game/getPiecesDir");
        const data = await response.json();
        const dir = data.dir;

        if(dir.includes("default")){
            useDir = defaultDir;
            console.log("Use defalut image.");
        }else{
            useDir = piecesDir
            console.log("Use uploaded image.");
        };
        initializeBoard()
    } catch (err) {
        console.error("❌ Failed to load pieces directory:", err);
    }
});

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

let claimRewardBtn = document.getElementById("btn_claim_reward");
claimRewardBtn.addEventListener('click' , toggleClaimReward);

const openBtn = document.getElementById("btn_claim_reward");
const popup = document.getElementById("popup-claimReward");
const closeBtn = document.getElementById("closeClaimPopup");
const overlay = document.getElementById("overlay-claim");
openBtn.addEventListener("click", () => {
  popup.classList.add("active");
});

const connectWallet_btn = document
    .getElementById("connectWalletBtn")
    .addEventListener("click", connectWallet);

function closePopup() {
    popup.classList.remove("active");
}


// Handling Help, About and other text contents.
async function loadPopupContent(
    filePath,
    elementId
) {
    try {
        const response = await fetch(filePath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (err) {
        console.error("Failed loading popup content", err);
    }
}

/**
 * Loads content for Help, About and Welcome popups from text files.
 */
document.addEventListener(
    "DOMContentLoaded",
    () => {
        loadPopupContent(
            "textContent/help.html",
            "helpContent"
        );
        loadPopupContent(
            "textContent/about.html",
            "aboutContent"
        );
        loadPopupContent(
            "textContent/leftPanel.html",
            "welcomeContent"
        );
    }
);


/**
 * Claim NFT Rewards button handler.
 * Sends Session Id and Wallet Address to backend.
 * Resets Currently Owned Tokens counter.
 * Closes popup window.
 */
document.getElementById("claimForm").addEventListener("submit", async (e) => {
  e.preventDefault();

    
    const sessionId = getSessionId();
    const walletAddress = document.getElementById("walletAddress").value;

    try {
    const response = await fetch("/api/game/claim", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        sessionId,
        walletAddress
        })
    });

    const data = await response.json();
    const { mintNFT } = await import("./web3.js");

    if (response.ok) {
        console.log("Claim successful");

        // // ✅ update UI
        // document.getElementById("tokenBalance").innerText = data.balance;
        // updateClaimButton(data.balance);

        // // ✅ CLOSE POPUP HERE
        // closeClaimPopup();
        // 🔥 NEW: mint NFT on blockchain
        if (!data.tokenURI) {
            alert("Missing tokenURI from backend");
            return;
        }

        console.log("Minting NFT with tokenURI:", data.tokenURI);

        try {
            await mintNFT(data.tokenURI);
            alert("NFT successfully minted!");
        } catch (err) {
            console.error("Minting failed:", err);
            alert("Transaction failed or rejected");
            return;
        }

        // ✅ update UI AFTER mint
        document.getElementById("tokenBalance").innerText = data.balance;
        updateClaimButton(data.balance);

        closeClaimPopup();

    } else {
        alert(data.error);
    }
    } catch (err) {
        console.error(err);
    }
});

function closeClaimPopup() {
    document
        .getElementById("popup-claimReward")
        .classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {
    document
        .getElementById("walletAddress")
        .addEventListener("input", updateClaimSubmitState);
});

closeBtn.addEventListener("click", closePopup);
overlay.addEventListener("click", closePopup);

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
        updateLocalStorage(ranking); // To be deleted 

    sendResult(setName, turns)
    console.log("Sending username and result to backend.")
    document.getElementById("popup-2").classList.toggle("active");
}

/**
 * Activate and deactivate Popup window when the game is won but the result doesn't 
 * qualify to the Best Results.
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

function toggleClaimReward(){
    document.getElementById("popup-claimReward").classList.toggle("active");
}

/**
 * Used in onLoad function to initialize the pieces array.
 */
function setPieces(){
    console.log("Set pieces")
    for (let i=0; i < rows*columns; i++) {
        pieces.push(i.toString()); //put "1" to "20" into the array (puzzle images names)
    }
}

/*
    Take an Array of pieces and return a new 
    array of pieces ordered randomly.
*/ 
function shuffle(piecesList){
    console.log("Shuffle pieces")
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
    console.log("Sort in order.")
    let board = document.getElementById("board");
    let tiles = board.children;

    for (let i = 0; i < pieces.length; i++) {    // Put pieces in the order. From 1 to 10.
        tiles[i].src = useDir+"/piece_" + (i) + ".jpg";
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
        tiles[i].src = useDir+"/piece_" + shuffledPieces[i] + ".jpg";
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
            tile.style.opacity = "0.3";
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
        tile.style.border = "2px solid var(--borders-color)";
        tile.style.opacity = "1";
    }
    this.style.border = "2px solid var(--borders-color)";
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
            document.getElementById('message_box').innerText = "You can only swap a tile with an adjacent and highlighted tiles";
            setTimeout(() => {
                document.getElementById('message_box').innerText = "";
            }, 3000);
        }                                                    
    }
  
    document.getElementById("turns").innerText = turns;
    isSolved();
}


/**
 * Checking if all pieces are arranged in ascending order
 * 
 * To achive this, pieces numbers are extracted from pieces urls,
 * and then the pieces orders is checked. 
 * 
 * @returns True if the pieces are ordered or False if the pieces ale unordered
 */
function checkWinningCondition(){
    // src="https://swap-puzzle-game-2.onrender.com/assets/images/pieces/piece_19.jpg"

    if (turns <= 0 || !gameOn) return false;
    const children = Array.from(document.getElementById("board").children);
    const numbers = children.map(child => extractPieceNumber(child.src));

    return isAscending(numbers);
}

function extractPieceNumber(src) {
    const match = src.match(/piece_(\d+)\.jpg/);
    return match ? Number(match[1]) : null;
}

function isAscending(orderArray) {
    for (let i = 0; i < orderArray.length - 1; i++) {
        if (orderArray[i] > orderArray[i + 1]) {
            return false;
        }
    }
    return true;
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

    if(turns > 0 && gameOn === true && checkWinningCondition()){
        /**
         * If the condition is met and the game is won the code below is executed.
         * 
         * Depending on what condition is met Popup modal box will be initialized with a different String value
         * and corresponding functions will be called.
         */
        console.log("Solved!")

        if(ranking.length != 0 && turns < ranking[0].score){  // If the result is better than the first result in the ranking.
            document.getElementById("popupContentTwo").innerText = "You've solved the puzzles in "+turns+" turns!"+
            "\nThis is our new record! Put your name down.";
            togglePopup2(); 
            ranking.pop();   
        }else if(ranking.length < 10){                          // if the result list isn't full/it's length is smaller than 10.
            document.getElementById("popupContentTwo").innerHTML = 
            "You've solved the puzzles in "+turns+" turns!"+
            "\nThis qualify to our Best Results."+
            "\nWould you like to write your name to our best results list?"; 
            togglePopup2(); 
            ranking.pop();        
        }else if(turns < ranking[9].score && ranking.length>=10){ // if player qualify to the best results
            document.getElementById("popupContentTwo").innerHTML = 
            "\nYou've solved the puzzles in "+turns+" turns!"+
            "\nYou result qualifies to our Best Results."+
            "\nWould you like to write down your name to our best results list?"; 
            togglePopup2();
            ranking.pop();  
        }else{                                                  // if player doesn't qualify to the best results  
            document.getElementById("popupContentOne").innerText = "You've solved the puzzles in "+turns+" turns!"+
            "\nStart a new game to try again.";                           
            togglePopup();   
            ranking.pop(); 
        }  
        document.getElementById('btn_new_game').innerText = "Game Complete";
        gameOn = false;
        return true;

    }else if(gameOn == false){
        document.getElementById('message_box').innerText = 'Click "Start New Game" button.';
            setTimeout(() => {
                document.getElementById('message_box').innerText = "";
            }, 3000);
    }else{
        return false;
    }
}



/*

        Leaderboard hendling

*/


/**
 * Passes the players name and the result to the Java backend.
 * 
 * @param {*} username 
 * @param {*} moves 
 */
async function sendResult(username, moves) {
    const sessionId = getSessionId();
    try {

        const response = await fetch("/api/game/result", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            moves: moves,
            sessionId: sessionId
        })
        });

        // Update token balance, refresh leaderboard, update 'Get Reward Buttons' state.
        const data = await response.json();
        document.getElementById("tokenBalance").innerText = data.balance;
        await getRankingFromBackend();
        updateClaimButton(data.balance);

    } catch (error) {
        console.error("Failed to send result:", error);
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
        list += '<li>' + array[i].username+" : "+array[i].moves+" turns" + '</li>';
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
async function getRankingFromBackend() {
    try {
        const response = await fetch("/api/game/leaderboard");
        const items = await response.json();
        ranking = items.map(i => ({name: i.username,score: i.moves}));;
        updateHtmlList(items);
    } catch (error) {
        console.error("Failed to load leaderboard:", error);
    }
}

/**
 * Sends a request to the Java backend.
 * Receives top 10 results from the database.
 */
async function loadLeaderboard() {

  const res = await fetch("/api/game/leaderboard");
  const data = await res.json();
  return data;
}

/**
 * Get ession Id.
 * Session Id will be added to GameResult object to prevent
 * leaderboard spam
 * 
 * @returns 
 */
function getSessionId() {
  let sessionId = localStorage.getItem("puzzleSessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("puzzleSessionId", sessionId);
  }
  return sessionId;
}

/**
 * Loads token balance
 * for a specific sessionId.
 */
async function loadBalance() {
  const sessionId = getSessionId();

  try {
    const response = await fetch(
      `/api/game/wallet/${sessionId}`
    );

    const data = await response.json();
    document.getElementById("tokenBalance").innerText = data.balance;

    console.log("Token Balance: "+data.balance)

    // 🔹 disable/enable based on balance
    updateClaimButton(data.balance);

  } catch (error) {
    console.error("Failed to load balance:", error);
  }
}


async function claimReward() {
    console.log("Claim Reward")

    const sessionId = getSessionId();
    // const walletAddress = prompt("Enter your wallet address:");

    // if (!walletAddress) return;
    const walletAddress = localStorage.getItem("walletAddress");

    if (!walletAddress) {
        alert("Please connect your wallet first.");
        return;
    }else{
        walletAddress = prompt("Enter your wallet address:")
    }

    const response = await fetch("/api/game/claim", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        sessionId,
        walletAddress
    })
});

  const data = await response.json();

    if (response.ok) {
        alert(`Success! Remaining balance: ${data.balance}`);
        document.getElementById("tokenBalance").innerText = data.balance;
    } else {
        alert(data.error);
    }
    // Update 'Get Reward' buttons state
    updateClaimButton(data.balance);

}

function updateClaimButton(balance) {
  const button = document.getElementById("btn_claim_reward");
  button.disabled = balance < 100;
}

/*
            Connecting Wallet
*/

function isMetaMaskInstalled() {
  return typeof window.ethereum !== "undefined";
}

async function connectWallet() {
  if (!isMetaMaskInstalled()) {
    alert("MetaMask is not installed. Please install it to continue.");
    return;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    const walletAddress = accounts[0];
    console.log("Connected wallet:", walletAddress);

    document.getElementById("walletDisplay").innerText = walletAddress; // display in UI

    // store for later use (important!)
    localStorage.setItem("walletAddress", walletAddress);
    document.getElementById("walletDisplay").innerText = walletAddress; // display

    // 🔹 autofill input
    const input = document.getElementById("walletAddress");
    input.value = walletAddress;

    // 🔹 disable manual editing
    input.readOnly = true;
    updateClaimSubmitState(); 
  } catch (error) {
    console.error("User rejected connection:", error);
  }
}

/**
 * Load wallet from the local storage, if it
 * already exists, so user doesn't have to
 * reconnect every time. 
 */
function loadWallet() {
  const wallet = localStorage.getItem("walletAddress");

  const input = document.getElementById("walletAddress");

  if (wallet) {
    document.getElementById("walletDisplay").innerText = wallet;

    input.value = wallet;
    input.readOnly = true;
  }
}

/**
 * Toggles the Claim Reward buttons state
 * to change it's style.
 */
function updateClaimSubmitState() {

    console.log("Update Claim button")

    const input = document.getElementById("walletAddress");
    const button = document.getElementById("claimSubmitBtn");

    const hasValue = input.value && input.value.trim().length > 0;

    if (hasValue) {
    console.log("Submit claim button activated")
    button.disabled = false;
    button.classList.add("enabled");
    } else {
    console.log("Submit claim button disactivated")
    button.disabled = true;
    button.classList.remove("enabled");
    }
}

