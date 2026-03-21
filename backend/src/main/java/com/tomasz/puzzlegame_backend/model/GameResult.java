package com.tomasz.puzzlegame_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Table (name = "dt_game_result")
@Entity
public class GameResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    private int moves;
    private LocalDateTime playedAt;
    private UUID sessionId;
    private int reward;

    public GameResult() {}

    public GameResult(String username, int moves, UUID sessionId, int reward) {
        this.username = username;
        this.moves = moves;
        this.playedAt = LocalDateTime.now();
        this.sessionId = sessionId;
        this.reward = reward;
//        this.sessionId = UUID.randomUUID();
    }

    public String getUsername() {
        return username;
    }

    public int getMoves() {
        return moves;
    }

    public LocalDateTime getPlayedAt() {
        return playedAt;
    }

    public UUID getSessionId() {
        return sessionId;
    }

    public int getReward() {return reward;}

    public void setUsername(String username) {
        this.username = username;
    }

    public void setMoves(int moves) {
        this.moves = moves;
    }

    public void setPlayedAt(LocalDateTime playedAt) {
        this.playedAt = playedAt;
    }

    public void setSessionId(UUID sessionId) {
        this.sessionId = sessionId;
    }

    public void setReward(int reward) {this.reward = reward;}
}
