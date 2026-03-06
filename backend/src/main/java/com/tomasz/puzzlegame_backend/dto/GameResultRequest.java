package com.tomasz.puzzlegame_backend.dto;

public class GameResultRequest {
    private String username;
    private int moves;

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
}
