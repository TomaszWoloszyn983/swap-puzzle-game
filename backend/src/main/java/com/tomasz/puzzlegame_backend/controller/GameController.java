package com.tomasz.puzzlegame_backend.controller;
import com.tomasz.puzzlegame_backend.dto.ClaimRequest;
import com.tomasz.puzzlegame_backend.dto.GameResultRequest;
import com.tomasz.puzzlegame_backend.model.GameResult;
import com.tomasz.puzzlegame_backend.repository.GameResultRepository;
import com.tomasz.puzzlegame_backend.service.ClaimService;
import com.tomasz.puzzlegame_backend.service.RewardService;
import com.tomasz.puzzlegame_backend.service.WalletService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameResultRepository repository;
    private final RewardService rewardService;
    private final WalletService walletService;
    private final ClaimService claimService;
    String pathString = "uploads/pieces";
//    String pathString = "src/main/resources/static/assets/images/pieces";
    Path piecestDir = Paths.get(pathString);

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

    /**
     * Redirects the path to images pieces folder,
     * depending on whether the image is default or user-uploaded.
     *
     * @return
     */
    @GetMapping("/getPiecesDir")
    public Map<String, String> getPiecesDir() {
        Path piecesPath = piecestDir;
        System.out.println("Checking "+pathString+" folder for uploaded files: "+arePiecesReady());

        try (Stream<Path> files = Files.list(piecesPath)) {
            boolean hasFiles = files.findAny().isPresent();

            if (hasFiles) {
                return Map.of("dir", pathString);
            } else {
                return Map.of("dir", "assets/images/default");
            }
        } catch (IOException e) {
            return Map.of("dir", "assets/images/default");
        }
    }

    /**
     * Receives the image uploaded by the user.
     * Split the image into 20 pieces (5 rows and 4 columns)
     * Deletes previously used pieces
     *
     * @param file
     * @return
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) {
        try {
            System.out.println("Uploading image ...");
            BufferedImage original = ImageIO.read(file.getInputStream());
            int rows = 5;
            int cols = 4;
            int pieceWidth = original.getWidth() / cols;
            int pieceHeight = original.getHeight() / rows;
            Path outputDir = piecestDir;

            if (!Files.exists(outputDir)) {
                Files.createDirectories(outputDir);
            }

            // clear old pieces
            Files.list(outputDir).forEach(p -> {
                try { Files.delete(p); } catch (Exception ignored) {}
            });

            int count = 0; // Used to name pieces

            for (int y = 0; y < rows; y++) {
                for (int x = 0; x < cols; x++) {
                    BufferedImage subImage = original.getSubimage(
                            x * pieceWidth,
                            y * pieceHeight,
                            pieceWidth,
                            pieceHeight
                    );
                    File outputFile = outputDir.resolve("piece_" + count + ".jpg").toFile();
                    ImageIO.write(subImage, "jpg", outputFile);
                    count++;
                }
            }
            long count_pieces = Files.list(outputDir).count();

            if (count_pieces == 20) {
                System.out.println("Upload completed, "+count_pieces+" pieces added.");
            }else{
                throw new RuntimeException("Not all pieces generated!");
            }
            return ResponseEntity.ok(Map.of("message", "Image processed"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload failed");
        }
    }

    /**
     * Check if the pieces folder is not empty
     * and
     * if the number of pieces is equal to 20
     * @return True is both conditions are met.
     */
    @GetMapping("/pieces-ready")
    public boolean arePiecesReady() {
        System.out.println("Check if pieces ready");
        File dir = new File("uploads/pieces");

        File[] files = dir.listFiles((d, name) -> name.endsWith(".jpg"));
        System.out.println("Number of pieces: "+files.length);
        return files != null && files.length == 20;
    }

}
