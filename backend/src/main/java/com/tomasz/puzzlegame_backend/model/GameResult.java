package com.tomasz.puzzlegame_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Table (name = "dt_game_result")
@Entity
public class GameResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String username;

    private int moves;

    private LocalDateTime playedAt;

    public GameResult() {}

    public GameResult(String username, int moves) {
        this.username = username;
        this.moves = moves;
        this.playedAt = LocalDateTime.now();
    }

}
