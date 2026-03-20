package com.tomasz.puzzlegame_backend.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "player_wallet")
public class PlayerWallet {
    @Id
    private UUID sessionId;

    private int tokenBalance;

    public PlayerWallet() {}

    public PlayerWallet(UUID sessionId) {
        this.sessionId = sessionId;
        this.tokenBalance = 0;
    }

    public UUID getSessionId() {
        return sessionId;
    }

    public void setSessionId(UUID sessionId) {
        this.sessionId = sessionId;
    }

    public int getTokenBalance() {
        return tokenBalance;
    }

    public void setTokenBalance(int tokenBalance) {
        this.tokenBalance = tokenBalance;
    }
}
