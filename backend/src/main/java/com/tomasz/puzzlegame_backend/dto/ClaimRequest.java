package com.tomasz.puzzlegame_backend.dto;

import java.util.UUID;

public class ClaimRequest {
    private UUID sessionId;
    private String walletAddress;

    public UUID getSessionId() {
        return sessionId;
    }

    public void setSessionId(UUID sessionId) {
        this.sessionId = sessionId;
    }

    public String getWalletAddress() {
        return walletAddress;
    }

    public void setWalletAddress(String walletAddress) {
        this.walletAddress = walletAddress;
    }
}
