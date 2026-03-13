package com.tomasz.puzzlegame_backend.service;

import com.tomasz.puzzlegame_backend.dto.GameResultRequest;
import com.tomasz.puzzlegame_backend.model.GameResult;
import com.tomasz.puzzlegame_backend.repository.GameResultRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class GameResultService {
    private final GameResultRepository repository;

    public GameResultService(GameResultRepository repository) {
        this.repository = repository;
    }

//    public void saveResult(String username, int moves) {
//        GameResult result = new GameResult(username, moves);
//        repository.save(result);
//    }

//    public void saveResult(GameResultRequest request) {
//
//        GameResult result = new GameResult();
//        result.setUsername(request.getUsername());
//        result.setMoves(request.getMoves());
//        result.setSessionId(request.getSessionId());
//        result.setPlayedAt(LocalDateTime.now());
//
//        repository.save(result);
//    }

    public void saveResult(GameResultRequest request) {
        Optional<GameResult> existing = repository.findBySessionId(request.getSessionId());

        if (existing.isPresent()) {
            GameResult result = existing.get();

            // only update if new score is better
            if (request.getMoves() < result.getMoves()) {
                result.setMoves(request.getMoves());
                result.setUsername(request.getUsername());
                result.setPlayedAt(LocalDateTime.now());
                repository.save(result);
            }
        } else {
            GameResult result = new GameResult();
            result.setUsername(request.getUsername());
            result.setMoves(request.getMoves());
            result.setSessionId(request.getSessionId());
            result.setPlayedAt(LocalDateTime.now());
            repository.save(result);
        }
    }

    public List<GameResult> getLeaderboard() {
        return repository.findTop10ByOrderByMovesAsc();
    }
}
