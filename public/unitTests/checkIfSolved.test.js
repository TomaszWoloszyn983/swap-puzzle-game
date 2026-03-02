function isSolved(){
    if(turns > 0 && gameOn === true){
        let currentOrder =  document.getElementById("board").children;
        let url = currentOrder[0].src.toString();
        let result = url.split('/assets');

        //  Check if the condition to win the game is met. If it isn't the function returns false and the rest of the code isn't executed.
        for(let i=0; i<pieces.length; i++){
            let orderedPiece = result[0]+"/"+useDir+"/piece_" + [i] + ".jpg";
            if(currentOrder[i].src == orderedPiece){
            }else{
                return false;
            }
        }
    }
}