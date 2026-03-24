package com.tomasz.puzzlegame_backend.service;

import com.tomasz.puzzlegame_backend.dto.ClaimRequest;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.UUID;

@Service
public class ClaimService {
    private final WalletService walletService;

    private static final int CLAIM_THRESHOLD = 100;

    public ClaimService(WalletService walletService) {
        this.walletService = walletService;
    }

    public Map<String, Object> claimReward(ClaimRequest request) {

        UUID sessionId = request.getSessionId();
        String walletAddress = request.getWalletAddress();

        int balance = walletService.getBalance(sessionId);

        if (balance < CLAIM_THRESHOLD) {
            throw new RuntimeException("Not enough tokens to claim reward");
        }

        // deduct tokens
        int newBalance = balance - CLAIM_THRESHOLD;

        walletService.updateBalance(sessionId, newBalance);

        // 🔹 placeholder for future NFT minting
        System.out.println("NFT would be minted to: " + walletAddress);

        return Map.of(
                "message", "Reward claimed successfully",
                "spent", CLAIM_THRESHOLD,
                "balance", newBalance
        );
    }
}
