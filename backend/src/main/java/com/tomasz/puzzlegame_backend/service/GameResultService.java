package com.tomasz.puzzlegame_backend.service;

import com.tomasz.puzzlegame_backend.model.GameResult;
import com.tomasz.puzzlegame_backend.repository.GameResultRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameResultService {
    private final GameResultRepository repository;

    public GameResultService(GameResultRepository repository) {
        this.repository = repository;
    }

    public void saveResult(String username, int moves) {
        GameResult result = new GameResult(username, moves);
        repository.save(result);
    }

    public List<GameResult> getLeaderboard() {
        return repository.findTop10ByOrderByMovesAsc();
    }
}
