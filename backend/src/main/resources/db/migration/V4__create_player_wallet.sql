CREATE TABLE player_wallet (
    session_id UUID PRIMARY KEY,
    token_balance INTEGER NOT NULL DEFAULT 0
);