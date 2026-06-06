package com.tomasz.puzzlegame_backend.service;

import com.tomasz.puzzlegame_backend.model.PlayerWallet;
import com.tomasz.puzzlegame_backend.repository.PlayerWalletRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class WalletService {

    private static final Logger log = LoggerFactory.getLogger(WalletService.class);
    private final PlayerWalletRepository repository;

    public WalletService(PlayerWalletRepository repository) {
        this.repository = repository;
    }

    public int addReward(UUID sessionId, int reward) {
        PlayerWallet wallet = repository.findById(sessionId)
                .orElse(new PlayerWallet(sessionId));
        wallet.setTokenBalance(wallet.getTokenBalance() + reward);
        repository.save(wallet);
        log.info("{} tokens added to wallet: {}", reward, wallet.getTokenBalance());
        return wallet.getTokenBalance();
    }

    public int getBalance(UUID sessionId) {
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
