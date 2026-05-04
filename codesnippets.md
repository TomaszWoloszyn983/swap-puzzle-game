# Code Snippets

## Get Reward Popup box
```html
  <!-- Trigger button -->
  <button type="button" id="btn_claim_reward">Claim NFT Reward</button>

  <!-- Popup -->
  <div class="popup" id="popup-claimReward">
      <div class="overlay" id="overlay-claim"></div>
      <div class="content">
          <h3>Claim NFT Reward</h3>
          <form id="claimForm">
              <input 
                  type="text" 
                  id="walletAddress" 
                  placeholder="Enter wallet address (0x...)" 
                  required
              >
              <br><br>
              <button type="submit">Claim</button>
          </form>
          <br>
          <button type="button" id="closeClaimPopup">Cancel</button>
      </div>
  </div>
```
 Button handler script.js

 ```js
  //  Initialize button
  let claimRewardBtn = document.getElementById("btn_claim_reward");
  claimRewardBtn.addEventListener('click' , toggleClaimReward);

  // Initialize popup
  const popup = document.getElementById("popup-claimReward");

  // Display popup when button is clicked
  function toggleClaimReward(){
      document.getElementById("popup-claimReward").classList.toggle("active");
  }

  // Initialize close popup button
  const closeBtn = document.getElementById("closeClaimPopup");

  // Close popup when button is clicked
  closeBtn.addEventListener("click", closePopup);
 ```

### Checking if a button click has any effect.
 ```js
 document.getElementById("tested_btn").addEventListener("submit", (e) => {
  console.log("I'm working");
});
 ```

 ### NFT Smart Contract (ERC-721)
 ```solidity
 // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

    contract PuzzleNFT is ERC721URIStorage {
        uint256 public tokenCounter;

        constructor() ERC721("PuzzleNFT", "PNFT") {
            tokenCounter = 0;
        }

        function mintNFT(address recipient, string memory tokenURI)
            public
            returns (uint256)
        {
            uint256 newItemId = tokenCounter;

            _safeMint(recipient, newItemId);
            _setTokenURI(newItemId, tokenURI);

            tokenCounter++;
            return newItemId;
        }
    }
 ```

## Display Text Content from other html file
 
 ```js
async function loadPopupContent(filePath, elementId) {

    try {
        const response = await fetch(filePath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (err) {
        console.error(
            "Failed loading popup content",
            err
        );
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
 ```
 ```html
<!-- Help Popup box -->
<div class = "popup" id="popup-help"> 
    <div class="overlay"></div>
    <div class="content">
        <!-- Insert help content from textContent/help.html -->
        <div id="helpContent"></div>
        <button type="button" id="closeHelp">Close</button>
    </div>
</div>
<!-- About Popup box -->
<div class = "popup" id="popup-about"> 
    <div class="overlay"></div>
    <div class="content">
        <!-- Insert help content from textContent/about.html -->
        <div id="aboutContent"></div>
        <button type="button" id="closeAbout">Close</button>
    </div>
</div>
 ```


