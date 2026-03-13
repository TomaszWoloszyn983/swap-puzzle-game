package com.tomasz.puzzlegame_backend.controller;
import com.tomasz.puzzlegame_backend.dto.GameResultRequest;
import com.tomasz.puzzlegame_backend.model.GameResult;
import com.tomasz.puzzlegame_backend.repository.GameResultRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/game")
//@CrossOrigin(origins = "http://localhost:3000")
public class GameController {

    private final GameResultRepository repository;

    public GameController(GameResultRepository repository) {
        this.repository = repository;
    }

    /**
     * Receive the players name and the number of turns
     * from the frontend.
     *
     * @param result
     * @return
     */
    @PostMapping("/result")
    public String receiveResult(@RequestBody GameResultRequest result) {

        GameResult gameResult = new GameResult(result.getUsername(), result.getMoves(), result.getSessionId());
        repository.save(gameResult);
        System.out.println("User: " + result.getUsername()
                +", Moves: " + result.getMoves()
                +", session id"+result.getSessionId());
        return "Result received!";
    }

    /**
     * Get top 10 results from the datatable
     *
     * @return List<GameResults>
     */
    @GetMapping("/leaderboard")
    public List<GameResult> leaderboard() {
        List<GameResult> bestResults = repository.findTop10ByOrderByMovesAsc();
        int counter = 0;
        for(GameResult result : bestResults){
            System.out.println("Result "+(++counter)+". Name: "+result.getUsername()+
                    ", Moves: "+result.getMoves());
        }
        return bestResults;
    }
}
