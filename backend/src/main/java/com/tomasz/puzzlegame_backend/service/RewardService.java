package com.tomasz.puzzlegame_backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class RewardService {

    private static final Logger log = LoggerFactory.getLogger(RewardService.class);

    public int calculateReward(int moves) {
        if (moves <= 35) {
            log.info("Moves: 50");
            return 50;
        }
        if (moves <= 50) {
            log.info("Reward: 35");
            return 35;
        }
        if (moves <= 65) {
            log.info("Reward: 15");
            return 15;
        }
        log.info("Reward: 5");
        return 5;
    }
}
