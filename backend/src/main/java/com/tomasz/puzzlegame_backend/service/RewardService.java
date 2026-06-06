package com.tomasz.puzzlegame_backend.service;

import org.springframework.stereotype.Service;

@Service
public class RewardService {

    public int calculateReward(int moves) {
        if (moves <= 35) {
            System.out.println("Reward: 50");
            return 50;
        }
        if (moves <= 50) {
            System.out.println("Reward: 30");
            return 30;
        }
        if (moves <= 65) {
            System.out.println("Reward: 15");
            return 15;
        }
        System.out.println("Reward: 5");
        return 5;
    }
}
