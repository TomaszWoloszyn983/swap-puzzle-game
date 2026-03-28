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


