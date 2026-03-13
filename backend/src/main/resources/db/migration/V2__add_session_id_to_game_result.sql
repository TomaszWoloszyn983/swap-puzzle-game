ALTER TABLE dt_game_result ADD COLUMN session_id UUID;
CREATE INDEX idx_session_id ON dt_game_result(session_id);