package com.tomasz.puzzlegame_backend.controller;
import com.tomasz.puzzlegame_backend.dto.GameResultRequest;
import com.tomasz.puzzlegame_backend.model.GameResult;
import com.tomasz.puzzlegame_backend.repository.GameResultRepository;
import com.tomasz.puzzlegame_backend.service.GameResultService;
import com.tomasz.puzzlegame_backend.service.RewardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/game")
//@CrossOrigin(origins = "http://localhost:3000")
public class GameController {

    private final GameResultRepository repository;
    private final GameResultService service;
    private final RewardService rewardService;

    public GameController(GameResultRepository repository, GameResultService service, RewardService rewardService) {
        this.repository = repository;
        this.service = service;
        this.rewardService = rewardService;
    }

    /**
     * Receive the players name and the number of turns
     * from the frontend.
     *
     * @param result
     * @return
     */
    @PostMapping("/result")
    public ResponseEntity<?> receiveResult(@RequestBody GameResultRequest result) {

        int reward = rewardService.calculateReward(result.getMoves());
        GameResult gameResult = new GameResult(result.getUsername(), result.getMoves(), result.getSessionId());
        repository.save(gameResult);
        System.out.println("User: " + result.getUsername()
                +", Moves: " + result.getMoves()
                +", session id"+result.getSessionId());
        return ResponseEntity.ok(Map.of(
                "message", "Result processed",
                "reward", reward
                ));
    }

    /**
     * Get top 10 results from the datatable
     *
     * @return List<GameResults>
     */
    @GetMapping("/leaderboard")
    public List<GameResult> leaderboard() {
        List<GameResult> bestResults = repository.findTop10ByOrderByMovesAsc();
        System.out.println("Loaded data from database: "+(bestResults.size()));
        return bestResults;
    }
}
