package com.tomasz.puzzlegame_backend.dto;

import java.util.UUID;

public class GameResultRequest {
    private String username;
    private int moves;
    private UUID sessionId;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getMoves() {
        return moves;
    }

    public void setMoves(int moves) {
        this.moves = moves;
    }

    public UUID getSessionId() {return sessionId;}
    public void setSessionId(UUID sessionId) {this.sessionId = sessionId;}
}
