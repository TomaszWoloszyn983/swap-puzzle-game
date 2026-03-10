DROP TABLE IF EXISTS dt_game_result;

CREATE TABLE dt_game_result (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    moves INTEGER NOT NULL,
    played_at TIMESTAMP NOT NULL
);

CREATE SEQUENCE puzzle_game_results_sequence
    START WITH 1
    INCREMENT BY 1;