package com.tomasz.puzzlegame_backend.repository;

import com.tomasz.puzzlegame_backend.model.PlayerWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface PlayerWalletRepository extends JpaRepository<PlayerWallet, UUID> {}
