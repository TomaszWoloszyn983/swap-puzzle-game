package com.tomasz.puzzlegame_backend.controller;
import com.tomasz.puzzlegame_backend.dto.ClaimRequest;
import com.tomasz.puzzlegame_backend.dto.GameResultRequest;
import com.tomasz.puzzlegame_backend.model.GameResult;
import com.tomasz.puzzlegame_backend.repository.GameResultRepository;
import com.tomasz.puzzlegame_backend.service.ClaimService;
import com.tomasz.puzzlegame_backend.service.GameResultService;
import com.tomasz.puzzlegame_backend.service.RewardService;
import com.tomasz.puzzlegame_backend.service.WalletService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameResultRepository repository;
    private final RewardService rewardService;
    private final WalletService walletService;
    private final ClaimService claimService;

    public GameController(GameResultRepository repository, RewardService rewardService, WalletService walletService, ClaimService claimService) {
        this.repository = repository;
        this.rewardService = rewardService;
        this.walletService = walletService;
        this.claimService = claimService;
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
        System.out.println("Session Id: "+result.getSessionId());
        int reward = rewardService.calculateReward(result.getMoves());
        GameResult gameResult = new GameResult(result.getUsername(), result.getMoves(), result.getSessionId(), reward);
        repository.save(gameResult);
        int balance = walletService.getBalance(result.getSessionId());
        int newBalance = walletService.addReward(result.getSessionId(), reward);

        System.out.println("User: " + result.getUsername()
                +", Moves: " + result.getMoves()
                +", session id: "+result.getSessionId()
                +", previous balance: "+balance
                +", reward: "+reward
                +", next balance: "+newBalance);

        return ResponseEntity.ok(Map.of(
            "message", "Result processed",
            "reward", reward,
            "balance", newBalance
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

    /**
     * Get token balance for a specific SessionId
     *
     * @param sessionId
     * @return
     */
    @GetMapping("/wallet/{sessionId}")
    public Map<String, Integer> getBalance(@PathVariable UUID sessionId) {
        System.out.println("Get balance.");
        int balance = walletService.getBalance(sessionId);
        System.out.println("Wallet Balance: "+balance);
        return Map.of("balance", balance);
    }

    @PostMapping("/claim")
    public ResponseEntity<?> claimReward(@RequestBody ClaimRequest request) {
        try {
            Map<String, Object> result = claimService.claimReward(request);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }
}
