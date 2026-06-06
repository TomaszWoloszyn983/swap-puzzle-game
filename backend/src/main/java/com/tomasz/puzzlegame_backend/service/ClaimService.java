package com.tomasz.puzzlegame_backend.service;

import com.tomasz.puzzlegame_backend.controller.GameController;
import com.tomasz.puzzlegame_backend.dto.ClaimRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.UUID;

@Service
public class ClaimService {

    private static final Logger log = LoggerFactory.getLogger(GameController.class);
    private final WalletService walletService;
    private static final int CLAIM_THRESHOLD = 100;

    public ClaimService(WalletService walletService) {
        this.walletService = walletService;
    }

    public Map<String, Object> claimReward(ClaimRequest request) {
        UUID sessionId = request.getSessionId();
        String walletAddress = request.getWalletAddress();

        int balance = walletService.getBalance(sessionId);
        // ✅ Generate NFT metadata URL
        String tokenURI = generateTokenURI(request);

        if (balance < CLAIM_THRESHOLD) {
            throw new RuntimeException("Not enough tokens to claim reward");
        }

        // deduct tokens
        int newBalance = balance - CLAIM_THRESHOLD;

        walletService.updateBalance(sessionId, newBalance);

        // 🔹 placeholder for future NFT minting
        log.info("NFT would be minted to: {}", walletAddress);

        return Map.of(
                "message", "Reward claimed successfully",
                "spent", CLAIM_THRESHOLD,
                "balance", newBalance,
                "tokenURI", tokenURI
        );
    }

    private String generateTokenURI(ClaimRequest request) {
        log.info("Generate token>");
        return "https://raw.githubusercontent.com/ethereum/ethereum-org-website/dev/src/data/nft-metadata.json";
    }
}
