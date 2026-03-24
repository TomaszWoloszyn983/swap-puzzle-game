package com.tomasz.puzzlegame_backend.service;

import com.tomasz.puzzlegame_backend.model.PlayerWallet;
import com.tomasz.puzzlegame_backend.repository.PlayerWalletRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class WalletService {

    private final PlayerWalletRepository repository;

    public WalletService(PlayerWalletRepository repository) {
        this.repository = repository;
    }

    public int addReward(UUID sessionId, int reward) {
        PlayerWallet wallet = repository.findById(sessionId)
                .orElse(new PlayerWallet(sessionId));
        wallet.setTokenBalance(wallet.getTokenBalance() + reward);
        repository.save(wallet);
        System.out.println(reward+" tokens added to wallet: " + wallet.getTokenBalance());
        return wallet.getTokenBalance();
    }

    public int getBalance(UUID sessionId) {
        System.out.println("Get balance.");
        return repository.findById(sessionId)
            .map(PlayerWallet::getTokenBalance)
            .orElse(0);
    }

    public void updateBalance(UUID sessionId, int newBalance) {
        PlayerWallet wallet = repository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        wallet.setTokenBalance(newBalance);
        repository.save(wallet);
    }
}
