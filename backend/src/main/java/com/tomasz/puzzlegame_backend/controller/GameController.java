package com.tomasz.puzzlegame_backend.controller;
import com.tomasz.puzzlegame_backend.dto.GameResultRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
//@CrossOrigin(origins = "http://localhost:3000")
public class GameController {
    @PostMapping("/result")
    public String receiveResult(@RequestBody GameResultRequest result) {

        System.out.println("User: " + result.getUsername());
        System.out.println("Moves: " + result.getMoves());

        return "Result received!";
    }
}
