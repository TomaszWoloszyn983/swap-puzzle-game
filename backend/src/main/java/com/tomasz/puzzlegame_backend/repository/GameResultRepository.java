package com.tomasz.puzzlegame_backend.repository;

import com.tomasz.puzzlegame_backend.model.GameResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GameResultRepository extends JpaRepository<GameResult, Long> {
    List<GameResult> findTop10ByOrderByMovesAsc();
}
